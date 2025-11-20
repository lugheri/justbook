/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICacheRepository } from '@/infra/interfaces/icache.repository'
import { ISpecialtyRepository } from '../interfaces/ispecialty.repository'
import { Specialty, Prisma, PrismaClient } from '@prisma/client'
import { SpecialtyEntity } from '../../entities/Specialty.entity'

export class PrismaSpecialtyRepository implements ISpecialtyRepository {
  private readonly CACHE_PREFIX = 'specialty'
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
    data: Prisma.SpecialtyUncheckedCreateInput,
  ): Promise<SpecialtyEntity> {
    try {
      const specialty = await this.prismaClient.specialty.create({ data })
      // ✅ Invalida tanto get quanto list
      await this.invalidateListCache()

      return this.toEntity(specialty)
    } catch (error) {
      this.logger.error('Error create specialty', error)
      throw error
    }
  }

  // ========================
  // * READ ITEM - cRud
  // ========================
  async get(id: number): Promise<SpecialtyEntity | null> {
    const keyCache = `${this.CACHE_PREFIX}:get:${id}`
    try {
      // ✅ Tentar cache primeiro (com fallback)
      const cached = await this.cacheRepository.getOrSetWithNull(
        keyCache,
        async () => {
          const specialty = await this.prismaClient.specialty.findFirst({
            where: { id },
          })
          return specialty ? JSON.stringify(specialty) : null
        },
        this.CACHE_TTL,
      )

      if (!cached) {
        this.logger.debug(`Specialty not found: ${id}`)
        return null
      }

      try {
        const parsed = JSON.parse(cached)
        return this.toEntity(parsed)
      } catch (parseError) {
        this.logger.error(`Error parsing cached specialty: ${id}`, parseError)
        await this.cacheRepository.delete(keyCache)
        return await this.get(id)
      }
    } catch (error) {
      this.logger.error(`Error getting specialty: ${id}`, error)
      throw error
    }
  }

  // ========================
  // * UPDATE ITEM - crUd
  // ========================
  async update(
    id: number,
    data: Prisma.SpecialtyUncheckedUpdateInput,
  ): Promise<SpecialtyEntity> {
    try {
      const specialty = await this.prismaClient.specialty.update({
        where: { id },
        data,
      })
      // ✅ Invalida get específico + todas as listas
      await Promise.all([
        this.cacheRepository.delete(`${this.CACHE_PREFIX}:get:${id}`),
        this.invalidateListCache(),
      ])
      return this.toEntity(specialty)
    } catch (error) {
      this.logger.error(`Error updating specialty ${id}:`, error)
      throw error
    }
  }

  // ========================
  // * DELETE ITEM - cruD
  // ========================
  async delete(id: number): Promise<boolean> {
    try {
      await this.prismaClient.specialty.delete({
        where: { id },
      })
      // ✅ Invalida get específico + todas as listas
      await Promise.all([
        this.cacheRepository.delete(`${this.CACHE_PREFIX}:get:${id}`),
        this.invalidateListCache(),
      ])
      return true
    } catch (error) {
      this.logger.error(`Error deleting specialty ${id}:`, error)
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
    specialties: SpecialtyEntity[]
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
      const response = await this.fetchListSpecialty(page, active, name)

      // ✅ Cachear resultado
      await this.cacheRepository.set(
        cacheKey,
        JSON.stringify(response),
        this.LIST_CACHE_TTL,
      )
      return response
    } catch (error) {
      this.logger.error('Error listing specialty:', error)
      throw error
    }
  }

  // ========================
  // * LIST ITEMS - ALL
  // ========================
  async listAll(active: number): Promise<SpecialtyEntity[]> {
    const keyCache = `${this.CACHE_PREFIX}:list:all:active:${active}`
    try {
      // ✅ Tentar cache primeiro (com fallback)
      const cached = await this.cacheRepository.getOrSetWithNull(
        keyCache,
        async () => {
          const specialty = await this.prismaClient.specialty.findMany({
            where: { active },
          })
          return specialty ? JSON.stringify(specialty) : null
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
          `Error parsing cached list all specialty: active ${active}`,
          parseError,
        )
        await this.cacheRepository.delete(keyCache)
        return await this.listAll(active)
      }
    } catch (error) {
      this.logger.error(`Error getting specialty: active ${active}`, error)
      throw error
    }
  }

  // ========================
  // * FIND ITEM
  // ========================
  async findByName(name: string): Promise<SpecialtyEntity | null> {
    try {
      const specialty = await this.prismaClient.specialty.findFirst({
        where: { name },
      })
      if (!specialty) return null
      return this.toEntity(specialty)
    } catch (error) {
      this.logger.error(`Error getting specialty by name: ${name}`, error)
      throw error
    }
  }

  // ========================
  // ? HELPERS
  // ========================

  // ========================
  // * SET ENTITY
  // ========================
  private toEntity(specialty: Specialty): SpecialtyEntity {
    return new SpecialtyEntity(
      specialty.id,
      specialty.name,
      specialty.description,
      specialty.created_at,
      specialty.updated_at,
      specialty.active,
    )
  }

  // ========================
  // * INVALIDATE CACHE
  // ========================
  /**
   * ✅ Invalida todas as listas
   * Chamada em create/update/delete de specialty
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
    specialties: SpecialtyEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  } {
    try {
      const parsed = JSON.parse(cached)

      // ✅ Validar estrutura
      if (!parsed.specialty || !parsed.meta) {
        throw new Error('Invalid cache structure')
      }

      // ✅ Converter para entidades
      return {
        specialties: parsed.specialty.map((acc: any) => this.toEntity(acc)),
        meta: parsed.meta,
      }
    } catch (error) {
      this.logger.error('Error parsing list cache:', error)
      throw error
    }
  }

  // ========================
  // * FETCH LIST SPECIALTY
  // ========================
  /**
   * ✅ Busca dados do banco
   */
  private async fetchListSpecialty(
    page: number,
    active: number,
    name?: string,
  ): Promise<{
    specialties: SpecialtyEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }> {
    // ✅ Validar página
    const validPage = Math.max(1, page)
    const take = this.PAGINATION_SIZE
    const skip = (validPage - 1) * take

    // ✅ Construir where dinamicamente
    const where = this.buildWhereClause(active, name)

    // ✅ Buscar em paralelo
    const [specialty, totalCount] = await Promise.all([
      this.prismaClient.specialty.findMany({
        where,
        take,
        skip,
        orderBy: { created_at: 'desc' }, // ✅ Ordem consistent
      }),
      this.prismaClient.specialty.count({ where }),
    ])

    return {
      specialties: specialty.map((acc) => this.toEntity(acc)),
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
  ): Prisma.SpecialtyWhereInput {
    const where: Prisma.SpecialtyWhereInput = {
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
