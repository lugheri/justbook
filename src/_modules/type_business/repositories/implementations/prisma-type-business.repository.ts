/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICacheRepository } from '@/infra/interfaces/icache.repository'
import { ITypeBusinessRepository } from '../interfaces/itype-business.repository'
import { TypeBusiness, Prisma, PrismaClient } from '@prisma/client'
import { TypeBusinessEntity } from '../../entities/TypeBusiness.entity'

export class PrismaTypeBusinessRepository implements ITypeBusinessRepository {
  private readonly CACHE_PREFIX = 'type_business'
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
    data: Prisma.TypeBusinessUncheckedCreateInput,
  ): Promise<TypeBusinessEntity> {
    try {
      const type_business = await this.prismaClient.typeBusiness.create({
        data,
      })
      // ✅ Invalida tanto get quanto list
      await this.invalidateListCache()

      return this.toEntity(type_business)
    } catch (error) {
      this.logger.error('Error create type_business', error)
      throw error
    }
  }

  // ========================
  // * READ ITEM - cRud
  // ========================
  async get(id: number): Promise<TypeBusinessEntity | null> {
    const keyCache = `${this.CACHE_PREFIX}:get:${id}`
    try {
      // ✅ Tentar cache primeiro (com fallback)
      const cached = await this.cacheRepository.getOrSetWithNull(
        keyCache,
        async () => {
          const type_business = await this.prismaClient.typeBusiness.findFirst({
            where: { id },
          })
          return type_business ? JSON.stringify(type_business) : null
        },
        this.CACHE_TTL,
      )

      if (!cached) {
        this.logger.debug(`TypeBusiness not found: ${id}`)
        return null
      }

      try {
        const parsed = JSON.parse(cached)
        return this.toEntity(parsed)
      } catch (parseError) {
        this.logger.error(
          `Error parsing cached type_business: ${id}`,
          parseError,
        )
        await this.cacheRepository.delete(keyCache)
        return await this.get(id)
      }
    } catch (error) {
      this.logger.error(`Error getting type_business: ${id}`, error)
      throw error
    }
  }

  // ========================
  // * UPDATE ITEM - crUd
  // ========================
  async update(
    id: number,
    data: Prisma.TypeBusinessUncheckedUpdateInput,
  ): Promise<TypeBusinessEntity> {
    try {
      const type_business = await this.prismaClient.typeBusiness.update({
        where: { id },
        data,
      })
      // ✅ Invalida get específico + todas as listas
      await Promise.all([
        this.cacheRepository.delete(`${this.CACHE_PREFIX}:get:${id}`),
        this.invalidateListCache(),
      ])
      return this.toEntity(type_business)
    } catch (error) {
      this.logger.error(`Error updating type_business ${id}:`, error)
      throw error
    }
  }

  // ========================
  // * DELETE ITEM - cruD
  // ========================
  async delete(id: number): Promise<boolean> {
    try {
      await this.prismaClient.typeBusiness.delete({
        where: { id },
      })
      // ✅ Invalida get específico + todas as listas
      await Promise.all([
        this.cacheRepository.delete(`${this.CACHE_PREFIX}:get:${id}`),
        this.invalidateListCache(),
      ])
      return true
    } catch (error) {
      this.logger.error(`Error deleting type_business ${id}:`, error)
      throw error
    }
  }

  // ========================
  // * LIST ITEMS - PAGINATED
  // ========================
  async list(
    page: number,
    name?: string,
  ): Promise<{
    type_business: TypeBusinessEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }> {
    const cacheKey = this.buildListCacheKey(page, name)
    try {
      // ✅ Tentar cache primeiro
      const cached = await this.cacheRepository.get(cacheKey)
      if (cached) {
        return this.parseListResponse(cached)
      }

      // ✅ Buscar do banco
      const response = await this.fetchListTypeBusiness(page, name)

      // ✅ Cachear resultado
      await this.cacheRepository.set(
        cacheKey,
        JSON.stringify(response),
        this.LIST_CACHE_TTL,
      )
      return response
    } catch (error) {
      this.logger.error('Error listing type_business:', error)
      throw error
    }
  }

  // ========================
  // * LIST ITEMS - ALL
  // ========================
  async listAll(): Promise<TypeBusinessEntity[]> {
    const keyCache = `${this.CACHE_PREFIX}:list:all`
    try {
      // ✅ Tentar cache primeiro (com fallback)
      const cached = await this.cacheRepository.getOrSetWithNull(
        keyCache,
        async () => {
          const type_business = await this.prismaClient.typeBusiness.findMany()
          return type_business ? JSON.stringify(type_business) : null
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
          `Error parsing cached list all type_business`,
          parseError,
        )
        await this.cacheRepository.delete(keyCache)
        return await this.listAll()
      }
    } catch (error) {
      this.logger.error(`Error getting type_business`, error)
      throw error
    }
  }

  // ========================
  // * FIND ITEM
  // ========================
  async findByName(name: string): Promise<TypeBusinessEntity | null> {
    try {
      const type_business = await this.prismaClient.typeBusiness.findFirst({
        where: { name },
      })
      if (!type_business) return null
      return this.toEntity(type_business)
    } catch (error) {
      this.logger.error(`Error getting type_business by name: ${name}`, error)
      throw error
    }
  }

  // ========================
  // ? HELPERS
  // ========================

  // ========================
  // * SET ENTITY
  // ========================
  private toEntity(type_business: TypeBusiness): TypeBusinessEntity {
    return new TypeBusinessEntity(
      type_business.id,
      type_business.name,
      type_business.description,
    )
  }

  // ========================
  // * INVALIDATE CACHE
  // ========================
  /**
   * ✅ Invalida todas as listas
   * Chamada em create/update/delete de typebusiness
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
  private buildListCacheKey(page: number, name?: string): string {
    const parts = [this.CACHE_PREFIX, 'list', `page:${page}`]
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
    type_business: TypeBusinessEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  } {
    try {
      const parsed = JSON.parse(cached)

      // ✅ Validar estrutura
      if (!parsed.type_business || !parsed.meta) {
        throw new Error('Invalid cache structure')
      }

      // ✅ Converter para entidades
      return {
        type_business: parsed.typeBusiness.map((acc: any) =>
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
  // * FETCH LIST TYPEBUSINESS
  // ========================
  /**
   * ✅ Busca dados do banco
   */
  private async fetchListTypeBusiness(
    page: number,
    name?: string,
  ): Promise<{
    type_business: TypeBusinessEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }> {
    // ✅ Validar página
    const validPage = Math.max(1, page)
    const take = this.PAGINATION_SIZE
    const skip = (validPage - 1) * take

    // ✅ Construir where dinamicamente
    const where = this.buildWhereClause(name)

    // ✅ Buscar em paralelo
    const [type_business, totalCount] = await Promise.all([
      this.prismaClient.typeBusiness.findMany({
        where,
        take,
        skip,
        orderBy: { id: 'desc' }, // ✅ Ordem consistent
      }),
      this.prismaClient.typeBusiness.count({ where }),
    ])

    return {
      type_business: type_business.map((acc) => this.toEntity(acc)),
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
  private buildWhereClause(name?: string): Prisma.TypeBusinessWhereInput {
    const where: Prisma.TypeBusinessWhereInput = {}

    if (name && name.trim()) {
      where.name = {
        contains: name.trim(),
      }
    }

    return where
  }
}
