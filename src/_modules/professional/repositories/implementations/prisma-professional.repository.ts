/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICacheRepository } from '@/infra/interfaces/icache.repository'
import { IProfessionalRepository } from '../interfaces/iprofessional.repository'
import { Professional, Prisma, PrismaClient } from '@prisma/client'
import { ProfessionalEntity } from '../../entities/Professional.entity'

export class PrismaProfessionalRepository implements IProfessionalRepository {
  private readonly CACHE_PREFIX = 'professional'
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
  async create(
    data: Prisma.ProfessionalUncheckedCreateInput,
  ): Promise<ProfessionalEntity> {
    try {
      const professional = await this.prismaClient.professional.create({ data })
      // ✅ Invalida tanto get quanto list
      await this.invalidateListCache()

      return this.toEntity(professional)
    } catch (error) {
      this.logger.error('Error create professional', error)
      throw error
    }
  }

  // ========================
  // * READ ITEM - cRud
  // ========================
  async get(id: number): Promise<ProfessionalEntity | null> {
    const keyCache = `${this.CACHE_PREFIX}:get:${id}`
    try {
      // ✅ Tentar cache primeiro (com fallback)
      const cached = await this.cacheRepository.getOrSetWithNull(
        keyCache,
        async () => {
          const professional = await this.prismaClient.professional.findFirst({
            where: { id },
          })
          return professional ? JSON.stringify(professional) : null
        },
        this.CACHE_TTL,
      )

      if (!cached) {
        this.logger.debug(`Professional not found: ${id}`)
        return null
      }

      try {
        const parsed = JSON.parse(cached)
        return this.toEntity(parsed)
      } catch (parseError) {
        this.logger.error(
          `Error parsing cached professional: ${id}`,
          parseError,
        )
        await this.cacheRepository.delete(keyCache)
        return await this.get(id)
      }
    } catch (error) {
      this.logger.error(`Error getting professional: ${id}`, error)
      throw error
    }
  }

  // ========================
  // * UPDATE ITEM - crUd
  // ========================
  async update(
    id: number,
    data: Prisma.ProfessionalUncheckedUpdateInput,
  ): Promise<ProfessionalEntity> {
    try {
      const professional = await this.prismaClient.professional.update({
        where: { id },
        data,
      })
      // ✅ Invalida get específico + todas as listas
      await Promise.all([
        this.cacheRepository.delete(`${this.CACHE_PREFIX}:get:${id}`),
        this.invalidateListCache(),
      ])
      return this.toEntity(professional)
    } catch (error) {
      this.logger.error(`Error updating professional ${id}:`, error)
      throw error
    }
  }

  // ========================
  // * DELETE ITEM - cruD
  // ========================
  async delete(id: number): Promise<boolean> {
    try {
      await this.prismaClient.professional.delete({
        where: { id },
      })
      // ✅ Invalida get específico + todas as listas
      await Promise.all([
        this.cacheRepository.delete(`${this.CACHE_PREFIX}:get:${id}`),
        this.invalidateListCache(),
      ])
      return true
    } catch (error) {
      this.logger.error(`Error deleting professional ${id}:`, error)
      throw error
    }
  }

  // ========================
  // * LIST ITEMS - PAGINATED
  // ========================
  async list(
    page: number,
    active: number,
    name?: string,
  ): Promise<{
    professionals: ProfessionalEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }> {
    const cacheKey = this.buildListCacheKey(page, active, name)
    try {
      // ✅ Tentar cache primeiro
      const cached = await this.cacheRepository.get(cacheKey)
      if (cached) {
        return this.parseListResponse(cached)
      }

      // ✅ Buscar do banco
      const response = await this.fetchListProfessional(page, active, name)

      // ✅ Cachear resultado
      await this.cacheRepository.set(
        cacheKey,
        JSON.stringify(response),
        this.LIST_CACHE_TTL,
      )
      return response
    } catch (error) {
      this.logger.error('Error listing professional:', error)
      throw error
    }
  }

  // ========================
  // * LIST ITEMS - ALL
  // ========================
  async listAll(active: number): Promise<ProfessionalEntity[]> {
    const keyCache = `${this.CACHE_PREFIX}:list:all:active:${active}`
    try {
      // ✅ Tentar cache primeiro (com fallback)
      const cached = await this.cacheRepository.getOrSetWithNull(
        keyCache,
        async () => {
          const professional = await this.prismaClient.professional.findMany({
            where: { active },
          })
          return professional ? JSON.stringify(professional) : null
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
          `Error parsing cached list all professional: active ${active}`,
          parseError,
        )
        await this.cacheRepository.delete(keyCache)
        return await this.listAll(active)
      }
    } catch (error) {
      this.logger.error(`Error getting professional: active ${active}`, error)
      throw error
    }
  }

  // ========================
  // * FIND ITEM
  // ========================
  async findByName(name: string): Promise<ProfessionalEntity | null> {
    try {
      const professional = await this.prismaClient.professional.findFirst({
        where: { name },
      })
      if (!professional) return null
      return this.toEntity(professional)
    } catch (error) {
      this.logger.error(`Error getting professional by name: ${name}`, error)
      throw error
    }
  }

  // ========================
  // ? HELPERS
  // ========================

  // ========================
  // * SET ENTITY
  // ========================
  private toEntity(professional: Professional): ProfessionalEntity {
    return new ProfessionalEntity(
      professional.id,
      professional.business_id,
      professional.name,
      professional.email,
      professional.phone,
      professional.whatsapp,
      professional.photo_profile,
      professional.created_at,
      professional.updated_at,
      professional.active,
    )
  }

  // ========================
  // * INVALIDATE CACHE
  // ========================
  /**
   * ✅ Invalida todas as listas
   * Chamada em create/update/delete de professional
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
    active: number,
    name?: string,
  ): string {
    const parts = [
      this.CACHE_PREFIX,
      'list',
      `page:${page}`,
      `active:${active}`,
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
    professionals: ProfessionalEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  } {
    try {
      const parsed = JSON.parse(cached)

      // ✅ Validar estrutura
      if (!parsed.professional || !parsed.meta) {
        throw new Error('Invalid cache structure')
      }

      // ✅ Converter para entidades
      return {
        professionals: parsed.professional.map((acc: any) =>
          this.toEntity(acc),
        ),
        meta: parsed.meta,
      }
    } catch (error) {
      this.logger.error('Error parsing list cache:', error)
      throw error
    }
  }

  // ========================
  // * FETCH LIST PROFESSIONAL
  // ========================
  /**
   * ✅ Busca dados do banco
   */
  private async fetchListProfessional(
    page: number,
    active: number,
    name?: string,
  ): Promise<{
    professionals: ProfessionalEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }> {
    // ✅ Validar página
    const validPage = Math.max(1, page)
    const take = this.PAGINATION_SIZE
    const skip = (validPage - 1) * take

    // ✅ Construir where dinamicamente
    const where = this.buildWhereClause(active, name)

    // ✅ Buscar em paralelo
    const [professional, totalCount] = await Promise.all([
      this.prismaClient.professional.findMany({
        where,
        take,
        skip,
        orderBy: { created_at: 'desc' }, // ✅ Ordem consistent
      }),
      this.prismaClient.professional.count({ where }),
    ])

    return {
      professionals: professional.map((acc) => this.toEntity(acc)),
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
    active: number,
    name?: string,
  ): Prisma.ProfessionalWhereInput {
    const where: Prisma.ProfessionalWhereInput = {
      active,
    }

    if (name && name.trim()) {
      where.name = {
        contains: name.trim(),
      }
    }

    return where
  }
}
