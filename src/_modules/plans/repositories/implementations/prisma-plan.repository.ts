/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICacheRepository } from '@/infra/interfaces/icache.repository'
import { IPlanRepository } from '../interfaces/iplan.repository'
import { Plan, Prisma, PrismaClient } from '@prisma/client'
import { PlanEntity } from '../../entities/Plans.entity'

export class PrismaPlanRepository implements IPlanRepository {
  private readonly CACHE_PREFIX = 'plan'
  private readonly CACHE_TTL = 3600 // 1 hora
  private readonly LIST_CACHE_TTL = 1800 // 30 minutos
  private readonly PAGINATION_SIZE = 20
  private readonly logger = console

  constructor(
    private cacheRepository: ICacheRepository,
    private readonly prismaClient: PrismaClient,
  ) {}

  // ========================
  // * CREATE ITEM - Crud
  // ========================
  async create(data: Prisma.PlanUncheckedCreateInput): Promise<PlanEntity> {
    try {
      const plan = await this.prismaClient.plan.create({ data })
      // ✅ Invalida tanto get quanto list
      await this.invalidateListCache()

      return this.toEntity(plan)
    } catch (error) {
      this.logger.error('Error create plan', error)
      throw error
    }
  }

  // ========================
  // * READ ITEM - cRud
  // ========================
  async get(id: number): Promise<PlanEntity | null> {
    const keyCache = `${this.CACHE_PREFIX}:get:${id}`
    try {
      // ✅ Tentar cache primeiro (com fallback)
      const cached = await this.cacheRepository.getOrSetWithNull(
        keyCache,
        async () => {
          const plan = await this.prismaClient.plan.findFirst({
            where: { id },
          })
          return plan ? JSON.stringify(plan) : null
        },
        this.CACHE_TTL,
      )

      if (!cached) {
        this.logger.debug(`Plan not found: ${id}`)
        return null
      }

      try {
        const parsed = JSON.parse(cached)
        return this.toEntity(parsed)
      } catch (parseError) {
        this.logger.error(`Error parsing cached plan: ${id}`, parseError)
        await this.cacheRepository.delete(keyCache)
        return await this.get(id)
      }
    } catch (error) {
      this.logger.error(`Error getting plan: ${id}`, error)
      throw error
    }
  }

  // ========================
  // * UPDATE ITEM - crUd
  // ========================
  async update(
    id: number,
    data: Prisma.PlanUncheckedUpdateInput,
  ): Promise<PlanEntity> {
    try {
      const plan = await this.prismaClient.plan.update({
        where: { id },
        data,
      })
      // ✅ Invalida get específico + todas as listas
      await Promise.all([
        this.cacheRepository.delete(`${this.CACHE_PREFIX}:get:${id}`),
        this.invalidateListCache(),
      ])
      return this.toEntity(plan)
    } catch (error) {
      this.logger.error(`Error updating plan ${id}:`, error)
      throw error
    }
  }

  // ========================
  // * DELETE ITEM - cruD
  // ========================
  async delete(id: number): Promise<boolean> {
    try {
      await this.prismaClient.plan.delete({
        where: { id },
      })
      // ✅ Invalida get específico + todas as listas
      await Promise.all([
        this.cacheRepository.delete(`${this.CACHE_PREFIX}:get:${id}`),
        this.invalidateListCache(),
      ])
      return true
    } catch (error) {
      this.logger.error(`Error deleting plan ${id}:`, error)
      throw error
    }
  }

  // ========================
  // * LIST ITEMS - PAGINATED
  // ========================
  async list(
    page: number,
    status: 'active' | 'expired' | 'all',
    vigency: 'monthly' | 'annual' | 'all',
    name?: string,
  ): Promise<{
    plans: PlanEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }> {
    const cacheKey = this.buildListCacheKey(page, status, vigency, name)
    try {
      // ✅ Tentar cache primeiro
      const cached = await this.cacheRepository.get(cacheKey)
      if (cached) {
        return this.parseListResponse(cached)
      }

      // ✅ Buscar do banco
      const response = await this.fetchListPlan(page, status, vigency, name)

      // ✅ Cachear resultado
      await this.cacheRepository.set(
        cacheKey,
        JSON.stringify(response),
        this.LIST_CACHE_TTL,
      )
      return response
    } catch (error) {
      this.logger.error('Error listing plan:', error)
      throw error
    }
  }

  // ========================
  // * LIST ITEMS - ALL
  // ========================
  async listAll(active: number): Promise<PlanEntity[]> {
    const keyCache = `${this.CACHE_PREFIX}:list:all:active:${active}`
    try {
      // ✅ Tentar cache primeiro (com fallback)
      const cached = await this.cacheRepository.getOrSetWithNull(
        keyCache,
        async () => {
          const filter = active
            ? { expiration_date: { gt: new Date() } }
            : { expiration_date: { lte: new Date() } }
          const plan = await this.prismaClient.plan.findMany({ where: filter })
          return plan ? JSON.stringify(plan) : null
        },
        this.CACHE_TTL,
      )

      if (!cached) {
        return []
      }

      try {
        const parsed = JSON.parse(cached)
        return parsed.map((acc: any) => this.toEntity(acc))
      } catch (parseError) {
        this.logger.error(
          `Error parsing cached list all plan: active ${active}`,
          parseError,
        )
        await this.cacheRepository.delete(keyCache)
        return await this.listAll(active)
      }
    } catch (error) {
      this.logger.error(`Error getting plan: active ${active}`, error)
      throw error
    }
  }

  // ========================
  // * FIND ITEM
  // ========================
  async findByName(name: string): Promise<PlanEntity | null> {
    try {
      const plan = await this.prismaClient.plan.findFirst({
        where: { name },
      })
      if (!plan) return null
      return this.toEntity(plan)
    } catch (error) {
      this.logger.error(`Error getting plan by name: ${name}`, error)
      throw error
    }
  }

  // ========================
  // ? HELPERS
  // ========================

  // ========================
  // * SET ENTITY
  // ========================
  private toEntity(plan: Plan): PlanEntity {
    return new PlanEntity(
      plan.id,
      plan.name,
      plan.description,
      plan.vigency,
      plan.pay_day,
      plan.monthly_fee.toString(),
      plan.annual_price.toString(),
      plan.start_date,
      plan.expiration_date,
    )
  }

  // ========================
  // * INVALIDATE CACHE
  // ========================
  /**
   * ✅ Invalida todas as listas
   * Chamada em create/update/delete de plan
   */
  async invalidateListCache(): Promise<void> {
    try {
      // ✅ Deletar todas as pages com padrão "list"
      await this.cacheRepository.deleteKeysByPrefix(`${this.CACHE_PREFIX}:list`)
      this.logger.info('All list cache invalidated')
    } catch (error) {
      this.logger.error('Error invalidating list cache:', error)
      // ✅ Não lança erro se falhar, apenas loga
    }
  }

  // ========================
  // * BUILD LIST CACHEKEY
  // ========================
  /**
   * ✅ Constrói cache key de forma normalizada
   * Evita keys muito longas e undefined
   */
  private buildListCacheKey(
    page: number,
    status: 'active' | 'expired' | 'all',
    vigency: 'monthly' | 'annual' | 'all',
    name?: string,
  ): string {
    const parts = [
      this.CACHE_PREFIX,
      'list',
      `page:${page}`,
      `status:${status}`,
      `vigency:${vigency}`,
    ]
    // ✅ Apenas adiciona name se existir
    if (name) {
      parts.push(`name:${this.sanitizeForCache(name)}`)
    }
    return parts.join(':')
  }

  // ========================
  // * SANITIZE FOR CACHE
  // ========================
  /**
   * ✅ Sanitiza string para usar em cache key
   * Remove caracteres especiais, limita tamanho
   */
  private sanitizeForCache(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '') // Remove especiais
      .substring(0, 20) // Limita a 20 caracteres
  }

  // ========================
  // * PARSE LIST RESPONSE
  // ========================
  /**
   * ✅ Parse seguro da resposta em cache
   */
  private parseListResponse(cached: string): {
    plans: PlanEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  } {
    try {
      const parsed = JSON.parse(cached)

      // ✅ Validar estrutura
      if (!parsed.plan || !parsed.meta) {
        throw new Error('Invalid cache structure')
      }

      // ✅ Converter para entidades
      return {
        plans: parsed.plan.map((acc: any) => this.toEntity(acc)),
        meta: parsed.meta,
      }
    } catch (error) {
      this.logger.error('Error parsing list cache:', error)
      throw error
    }
  }

  // ========================
  // * FETCH LIST PLAN
  // ========================
  /**
   * ✅ Busca dados do banco
   */
  private async fetchListPlan(
    page: number,
    status: 'active' | 'expired' | 'all',
    vigency: 'monthly' | 'annual' | 'all',
    name?: string,
  ): Promise<{
    plans: PlanEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }> {
    // ✅ Validar página
    const validPage = Math.max(1, page)
    const take = this.PAGINATION_SIZE
    const skip = (validPage - 1) * take

    // ✅ Construir where dinamicamente
    const where = this.buildWhereClause(status, vigency, name)

    // ✅ Buscar em paralelo
    const [plan, totalCount] = await Promise.all([
      this.prismaClient.plan.findMany({
        where,
        take,
        skip,
        orderBy: { start_date: 'desc' }, // ✅ Ordem consistent
      }),
      this.prismaClient.plan.count({ where }),
    ])

    return {
      plans: plan.map((acc) => this.toEntity(acc)),
      meta: {
        page: validPage,
        perPage: take,
        totalCount,
      },
    }
  }

  // ========================
  // * BUILD WHERE CLAUSE
  // ========================
  private buildWhereClause(
    status: 'active' | 'expired' | 'all',
    vigency: 'monthly' | 'annual' | 'all',
    name?: string,
  ): Prisma.PlanWhereInput {
    const where: Prisma.PlanWhereInput = {}

    if (status === 'active') {
      where.expiration_date = { gt: new Date() }
    }

    if (status === 'expired') {
      where.expiration_date = { lte: new Date() }
    }

    if (vigency === 'monthly' || vigency === 'annual') {
      where.vigency = vigency
    }

    if (name && name.trim()) {
      where.name = {
        contains: name.trim(),
      }
    }

    return where
  }
}
