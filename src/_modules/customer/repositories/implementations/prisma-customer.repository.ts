/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICacheRepository } from '@/infra/interfaces/icache.repository'
import { ICustomerRepository } from '../interfaces/icustomer.repository'
import { Customer, Prisma, PrismaClient } from '@prisma/client'
import { CustomerEntity } from '../../entities/Customer.entity'

export class PrismaCustomerRepository implements ICustomerRepository {
  private readonly CACHE_PREFIX = 'customer'
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
    data: Prisma.CustomerUncheckedCreateInput,
  ): Promise<CustomerEntity> {
    try {
      const customer = await this.prismaClient.customer.create({ data })
      // ✅ Invalida tanto get quanto list
      await this.invalidateListCache()

      return this.toEntity(customer)
    } catch (error) {
      this.logger.error('Error create customer', error)
      throw error
    }
  }

  // ========================
  // * READ ITEM - cRud
  // ========================
  async get(id: number): Promise<CustomerEntity | null> {
    const keyCache = `${this.CACHE_PREFIX}:get:${id}`
    try {
      // ✅ Tentar cache primeiro (com fallback)
      const cached = await this.cacheRepository.getOrSetWithNull(
        keyCache,
        async () => {
          const customer = await this.prismaClient.customer.findFirst({
            where: { id },
          })
          return customer ? JSON.stringify(customer) : null
        },
        this.CACHE_TTL,
      )

      if (!cached) {
        this.logger.debug(`Customer not found: ${id}`)
        return null
      }

      try {
        const parsed = JSON.parse(cached)
        return this.toEntity(parsed)
      } catch (parseError) {
        this.logger.error(`Error parsing cached customer: ${id}`, parseError)
        await this.cacheRepository.delete(keyCache)
        return await this.get(id)
      }
    } catch (error) {
      this.logger.error(`Error getting customer: ${id}`, error)
      throw error
    }
  }

  // ========================
  // * UPDATE ITEM - crUd
  // ========================
  async update(
    id: number,
    data: Prisma.CustomerUncheckedUpdateInput,
  ): Promise<CustomerEntity> {
    try {
      const customer = await this.prismaClient.customer.update({
        where: { id },
        data,
      })
      // ✅ Invalida get específico + todas as listas
      await Promise.all([
        this.cacheRepository.delete(`${this.CACHE_PREFIX}:get:${id}`),
        this.invalidateListCache(),
      ])
      return this.toEntity(customer)
    } catch (error) {
      this.logger.error(`Error updating customer ${id}:`, error)
      throw error
    }
  }

  // ========================
  // * DELETE ITEM - cruD
  // ========================
  async delete(id: number): Promise<boolean> {
    try {
      await this.prismaClient.customer.delete({
        where: { id },
      })
      // ✅ Invalida get específico + todas as listas
      await Promise.all([
        this.cacheRepository.delete(`${this.CACHE_PREFIX}:get:${id}`),
        this.invalidateListCache(),
      ])
      return true
    } catch (error) {
      this.logger.error(`Error deleting customer ${id}:`, error)
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
    customers: CustomerEntity[]
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
      const response = await this.fetchListCustomer(page, name)

      // ✅ Cachear resultado
      await this.cacheRepository.set(
        cacheKey,
        JSON.stringify(response),
        this.LIST_CACHE_TTL,
      )
      return response
    } catch (error) {
      this.logger.error('Error listing customer:', error)
      throw error
    }
  }

  // ========================
  // * LIST ITEMS - ALL
  // ========================
  async listAll(): Promise<CustomerEntity[]> {
    const keyCache = `${this.CACHE_PREFIX}:list:all`
    try {
      // ✅ Tentar cache primeiro (com fallback)
      const cached = await this.cacheRepository.getOrSetWithNull(
        keyCache,
        async () => {
          const customer = await this.prismaClient.customer.findMany({
            where: {},
          })
          return customer ? JSON.stringify(customer) : null
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
        this.logger.error(`Error parsing cached list all customer`, parseError)
        await this.cacheRepository.delete(keyCache)
        return await this.listAll()
      }
    } catch (error) {
      this.logger.error(`Error getting customer`, error)
      throw error
    }
  }

  // ========================
  // * FIND ITEM
  // ========================
  async findByName(name: string): Promise<CustomerEntity | null> {
    try {
      const customer = await this.prismaClient.customer.findFirst({
        where: { name },
      })
      if (!customer) return null
      return this.toEntity(customer)
    } catch (error) {
      this.logger.error(`Error getting customer by name: ${name}`, error)
      throw error
    }
  }

  // ========================
  // ? HELPERS
  // ========================

  // ========================
  // * SET ENTITY
  // ========================
  private toEntity(customer: Customer): CustomerEntity {
    return new CustomerEntity(
      customer.id,
      customer.business_id,
      customer.name,
      customer.email,
      customer.phone,
      customer.whatsapp,
      customer.notes,
      customer.created_at,
      customer.updated_at,
    )
  }

  // ========================
  // * INVALIDATE CACHE
  // ========================
  /**
   * ✅ Invalida todas as listas
   * Chamada em create/update/delete de customer
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
    customers: CustomerEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  } {
    try {
      const parsed = JSON.parse(cached)

      // ✅ Validar estrutura
      if (!parsed.customer || !parsed.meta) {
        throw new Error('Invalid cache structure')
      }

      // ✅ Converter para entidades
      return {
        customers: parsed.customer.map((acc: any) => this.toEntity(acc)),
        meta: parsed.meta,
      }
    } catch (error) {
      this.logger.error('Error parsing list cache:', error)
      throw error
    }
  }

  // ========================
  // * FETCH LIST CUSTOMER
  // ========================
  /**
   * ✅ Busca dados do banco
   */
  private async fetchListCustomer(
    page: number,
    name?: string,
  ): Promise<{
    customers: CustomerEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }> {
    // ✅ Validar página
    const validPage = Math.max(1, page)
    const take = this.PAGINATION_SIZE
    const skip = (validPage - 1) * take

    // ✅ Construir where dinamicamente
    const where = this.buildWhereClause(name)

    // ✅ Buscar em paralelo
    const [customer, totalCount] = await Promise.all([
      this.prismaClient.customer.findMany({
        where,
        take,
        skip,
        orderBy: { created_at: 'desc' }, // ✅ Ordem consistent
      }),
      this.prismaClient.customer.count({ where }),
    ])

    return {
      customers: customer.map((acc) => this.toEntity(acc)),
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
  private buildWhereClause(name?: string): Prisma.CustomerWhereInput {
    const where: Prisma.CustomerWhereInput = {}

    if (name && name.trim()) {
      where.name = {
        contains: name.trim(),
      }
    }

    return where
  }
}
