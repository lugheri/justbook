/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICacheRepository } from '@/infra/interfaces/icache.repository'
import { IUserRepository } from '../interfaces/iuser.repository'
import { User, Prisma, PrismaClient } from '@prisma/client'
import { UserEntity } from '../../entities/User.entity'

export class PrismaUserRepository implements IUserRepository {
  private readonly CACHE_PREFIX = 'user'
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
  async create(data: Prisma.UserUncheckedCreateInput): Promise<UserEntity> {
    try {
      const user = await this.prismaClient.user.create({ data })
      // ✅ Invalida tanto get quanto list
      await this.invalidateListCache()

      return this.toEntity(user)
    } catch (error) {
      this.logger.error('Error create user', error)
      throw error
    }
  }

  // ========================
  // * READ ITEM - cRud
  // ========================
  async get(id: number): Promise<UserEntity | null> {
    const keyCache = `${this.CACHE_PREFIX}:get:${id}`
    try {
      // ✅ Tentar cache primeiro (com fallback)
      const cached = await this.cacheRepository.getOrSetWithNull(
        keyCache,
        async () => {
          const user = await this.prismaClient.user.findFirst({
            where: { id },
          })
          return user ? JSON.stringify(user) : null
        },
        this.CACHE_TTL,
      )

      if (!cached) {
        this.logger.debug(`User not found: ${id}`)
        return null
      }

      try {
        const parsed = JSON.parse(cached)
        return this.toEntity(parsed)
      } catch (parseError) {
        this.logger.error(`Error parsing cached user: ${id}`, parseError)
        await this.cacheRepository.delete(keyCache)
        return await this.get(id)
      }
    } catch (error) {
      this.logger.error(`Error getting user: ${id}`, error)
      throw error
    }
  }

  // ========================
  // * UPDATE ITEM - crUd
  // ========================
  async update(
    id: number,
    data: Prisma.UserUncheckedUpdateInput,
  ): Promise<UserEntity> {
    try {
      const user = await this.prismaClient.user.update({
        where: { id },
        data,
      })
      // ✅ Invalida get específico + todas as listas
      await Promise.all([
        this.cacheRepository.delete(`${this.CACHE_PREFIX}:get:${id}`),
        this.invalidateListCache(),
      ])
      return this.toEntity(user)
    } catch (error) {
      this.logger.error(`Error updating user ${id}:`, error)
      throw error
    }
  }

  // ========================
  // * DELETE ITEM - cruD
  // ========================
  async delete(id: number): Promise<boolean> {
    try {
      await this.prismaClient.user.delete({
        where: { id },
      })
      // ✅ Invalida get específico + todas as listas
      await Promise.all([
        this.cacheRepository.delete(`${this.CACHE_PREFIX}:get:${id}`),
        this.invalidateListCache(),
      ])
      return true
    } catch (error) {
      this.logger.error(`Error deleting user ${id}:`, error)
      throw error
    }
  }

  // ========================
  // * LIST ITEMS - PAGINATED
  // ========================
  async list(
    page: number,
    active: number,
    email?: string,
    name?: string,
  ): Promise<{
    users: UserEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }> {
    const cacheKey = this.buildListCacheKey(page, active, email, name)
    try {
      // ✅ Tentar cache primeiro
      const cached = await this.cacheRepository.get(cacheKey)
      if (cached) {
        return this.parseListResponse(cached)
      }

      // ✅ Buscar do banco
      const response = await this.fetchListUser(page, active, email, name)

      // ✅ Cachear resultado
      await this.cacheRepository.set(
        cacheKey,
        JSON.stringify(response),
        this.LIST_CACHE_TTL,
      )
      return response
    } catch (error) {
      this.logger.error('Error listing user:', error)
      throw error
    }
  }

  // ========================
  // * LIST ITEMS - ALL
  // ========================
  async listAll(active: number): Promise<UserEntity[]> {
    const keyCache = `${this.CACHE_PREFIX}:list:all:active:${active}`
    try {
      // ✅ Tentar cache primeiro (com fallback)
      const cached = await this.cacheRepository.getOrSetWithNull(
        keyCache,
        async () => {
          const user = await this.prismaClient.user.findMany({
            where: { active },
          })
          return user ? JSON.stringify(user) : null
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
          `Error parsing cached list all user: active ${active}`,
          parseError,
        )
        await this.cacheRepository.delete(keyCache)
        return await this.listAll(active)
      }
    } catch (error) {
      this.logger.error(`Error getting user: active ${active}`, error)
      throw error
    }
  }

  // ========================
  // * FIND ITEM
  // ========================
  async findByName(name: string): Promise<UserEntity | null> {
    try {
      const user = await this.prismaClient.user.findFirst({
        where: { name },
      })
      if (!user) return null
      return this.toEntity(user)
    } catch (error) {
      this.logger.error(`Error getting user by name: ${name}`, error)
      throw error
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    try {
      const user = await this.prismaClient.user.findFirst({
        where: { email },
      })
      if (!user) return null
      return this.toEntity(user)
    } catch (error) {
      this.logger.error(`Error getting user by email: ${email}`, error)
      throw error
    }
  }

  // ========================
  // ? HELPERS
  // ========================

  // ========================
  // * SET ENTITY
  // ========================
  private toEntity(user: User): UserEntity {
    return new UserEntity(
      user.id,
      user.business_id,
      user.name,
      user.email,
      user.phone,
      user.whatsapp,
      user.password,
      user.reset,
      user.photo_profile,
      user.created_at,
      user.updated_at,
      user.active,
    )
  }

  // ========================
  // * INVALIDATE CACHE
  // ========================
  /**
   * ✅ Invalida todas as listas
   * Chamada em create/update/delete de user
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
    email?: string,
    name?: string,
  ): string {
    const parts = [
      this.CACHE_PREFIX,
      'list',
      `page:${page}`,
      `active:${active}`,
    ]
    // ✅ Apenas adiciona name se existir
    if (email) {
      parts.push(`email:${this.sanitizeForCache(email)}`)
    }
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
    users: UserEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  } {
    try {
      const parsed = JSON.parse(cached)

      // ✅ Validar estrutura
      if (!parsed.user || !parsed.meta) {
        throw new Error('Invalid cache structure')
      }

      // ✅ Converter para entidades
      return {
        users: parsed.user.map((acc: any) => this.toEntity(acc)),
        meta: parsed.meta,
      }
    } catch (error) {
      this.logger.error('Error parsing list cache:', error)
      throw error
    }
  }

  // ========================
  // * FETCH LIST USER
  // ========================
  /**
   * ✅ Busca dados do banco
   */
  private async fetchListUser(
    page: number,
    active: number,
    email?: string,
    name?: string,
  ): Promise<{
    users: UserEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }> {
    // ✅ Validar página
    const validPage = Math.max(1, page)
    const take = this.PAGINATION_SIZE
    const skip = (validPage - 1) * take

    // ✅ Construir where dinamicamente
    const where = this.buildWhereClause(active, email, name)

    // ✅ Buscar em paralelo
    const [user, totalCount] = await Promise.all([
      this.prismaClient.user.findMany({
        where,
        take,
        skip,
        orderBy: { created_at: 'desc' }, // ✅ Ordem consistent
      }),
      this.prismaClient.user.count({ where }),
    ])

    return {
      users: user.map((acc) => this.toEntity(acc)),
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
    email?: string,
    name?: string,
  ): Prisma.UserWhereInput {
    const where: Prisma.UserWhereInput = {
      active,
    }

    if (email && email.trim()) {
      where.email = {
        contains: email.trim(),
      }
    }

    if (name && name.trim()) {
      where.name = {
        contains: name.trim(),
      }
    }
    return where
  }
}
