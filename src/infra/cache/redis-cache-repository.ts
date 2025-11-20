/* eslint-disable @typescript-eslint/no-explicit-any */

import { redis } from '@/shared/libs/redis'
import { ICacheRepository } from '../interfaces/icache.repository'

export class RedisCacheRepository implements ICacheRepository {
  // ========================
  // STRING METHODS
  // ========================

  async get(key: string): Promise<string | null> {
    try {
      const cachedData = await redis.get(key)
      return cachedData
    } catch (e) {
      console.error('Redis Get Error', e)
      return null
    }
  }

  async set(key: string, value: string, expire?: number): Promise<boolean> {
    try {
      expire
        ? await redis.set(key, value, 'EX', expire)
        : await redis.set(key, value)
      return true
    } catch (e) {
      console.error('Redis Set Error', e)
      return false
    }
  }

  async setMultiple(
    keysValues: { key: string; value: string; expire?: number }[],
  ): Promise<boolean> {
    try {
      const pipeline = redis.pipeline()
      keysValues.forEach(({ key, value, expire }) => {
        if (expire) {
          pipeline.set(key, value, 'EX', expire)
        } else {
          pipeline.set(key, value)
        }
      })
      await pipeline.exec()
      return true
    } catch (e) {
      console.error('Redis Set Multiple Error', e)
      return false
    }
  }

  async setIfNotExists(
    key: string,
    value: string,
    expire?: number,
  ): Promise<boolean> {
    try {
      const result = expire
        ? await redis.set(key, value, 'EX', expire, 'NX')
        : await redis.set(key, value, 'NX')
      return result !== null
    } catch (e) {
      console.error('Redis SetIfNotExists Error', e)
      return false
    }
  }

  async getOrSet(
    key: string,
    fallback: () => Promise<string>,
    expire?: number,
  ): Promise<string> {
    try {
      const cached = await this.get(key)
      if (cached) return cached

      const value = await fallback()
      await this.set(key, value, expire)
      return value
    } catch (e) {
      console.error('Redis GetOrSet Error', e)
      const value = await fallback()
      return value
    }
  }

  async getOrSetWithNull(
    key: string,
    fallback: () => Promise<string | null>,
    expire?: number,
  ): Promise<string | null> {
    try {
      const cached = await this.get(key)
      if (cached) return cached

      const value = await fallback()

      if (value === null) {
        await this.set(key, '__NULL__', expire)
        return null
      }

      await this.set(key, value, expire)
      return value
    } catch (e) {
      console.error('Redis GetOrSetWithNull  Error', e)
      const value = await fallback()
      return value
    }
  }

  async getAndDelete(key: string): Promise<string | null> {
    try {
      const value = await redis.getdel(key)
      return value
    } catch (e) {
      console.error('Redis GetAndDelete Error', e)
      return null
    }
  }

  async append(key: string, value: string): Promise<number> {
    try {
      const length = await redis.append(key, value)
      return length
    } catch (e) {
      console.error('Redis Append Error', e)
      return 0
    }
  }

  // ========================
  // KEY MANAGEMENT
  // ========================

  async delete(key: string): Promise<boolean> {
    try {
      await redis.del(key)
      return true
    } catch (e) {
      console.error('Redis Del Error', e)
      return false
    }
  }

  async deleteKeysByPrefix(prefix: string): Promise<boolean> {
    try {
      let cursor = '0'
      const keysToDelete: string[] = []

      // Use SCAN para encontrar as chaves
      do {
        const result = await redis.scan(
          cursor,
          'MATCH',
          `${prefix}*`,
          'COUNT',
          100,
        )
        cursor = result[0]
        const keys = result[1]
        keysToDelete.push(...keys)
      } while (cursor !== '0')

      if (keysToDelete.length > 0) {
        await redis.del(...keysToDelete)
      }
      return true
    } catch (e) {
      console.error('Redis Del by prefix Error', e)
      return false
    }
  }

  async deleteAll(): Promise<boolean> {
    try {
      await redis.flushdb()
      return true
    } catch (e) {
      console.error('Redis Flush Error', e)
      return false
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key)
      return result === 1
    } catch (e) {
      console.error('Redis Exists Error', e)
      return false
    }
  }

  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      await redis.expire(key, seconds)
      return true
    } catch (e) {
      console.error('Redis Expire Error', e)
      return false
    }
  }

  async ttl(key: string): Promise<number> {
    try {
      const ttl = await redis.ttl(key)
      return ttl // -1 = sem expiração, -2 = não existe
    } catch (e) {
      console.error('Redis TTL Error', e)
      return -2
    }
  }

  // ========================
  // PATTERN METHODS
  // ========================

  async keys(pattern: string): Promise<string[]> {
    try {
      const keys = await redis.keys(`${pattern}*`)
      return keys
    } catch (e) {
      console.error('Redis Keys Error', e)
      return []
    }
  }

  async scanKey(prefix: string): Promise<{
    keys: string[]
    values: any[]
  }> {
    let cursor = '0'
    const keys: any[] = []
    const values: any[] = []

    try {
      // Use SCAN to find all keys matching the pattern
      do {
        const result = await redis.scan(cursor, 'MATCH', `${prefix}*`)
        cursor = result[0]
        keys.push(...result[1])
      } while (cursor !== '0')

      if (keys.length > 0) {
        // Use MGET to get all the values of the found keys
        const retrievedValues = await redis.mget(...keys)
        retrievedValues.forEach((value: string | null) => {
          if (value !== null) {
            try {
              values.push(JSON.parse(value))
            } catch (error) {
              // Se não for JSON válido, adiciona como string
              values.push(value)
            }
          }
        })
      }

      return { keys, values }
    } catch (e) {
      console.error('Redis Scan Error', e)
      return { keys: [], values: [] }
    }
  }

  async fetchFirstNKeys(pattern: string, limit: number): Promise<any[]> {
    let cursor = '0'
    let keys: any[] = []
    try {
      do {
        const [nextCursor, results] = await redis.scan(
          cursor,
          'MATCH',
          `${pattern}*`,
          'COUNT',
          1000,
        )
        cursor = nextCursor
        keys = keys.concat(results)

        if (keys.length >= limit) {
          return keys.slice(0, limit)
        }
      } while (cursor !== '0')
      return keys
    } catch (e) {
      console.error('Redis FetchFirstNKeys Error', e)
      return []
    }
  }

  // ========================
  // COUNTER METHODS
  // ========================

  async increment(key: string, amount: number = 1): Promise<number> {
    try {
      const result = await redis.incrby(key, amount)
      return result
    } catch (e) {
      console.error('Redis Increment Error', e)
      return 0
    }
  }

  async decrement(key: string, amount: number = 1): Promise<number> {
    try {
      const result = await redis.decrby(key, amount)
      return result
    } catch (e) {
      console.error('Redis Decrement Error', e)
      return 0
    }
  }

  // ========================
  // LIST METHODS
  // ========================

  async insertList(
    key: string,
    value: string[],
    method: 'lpush' | 'rpush',
  ): Promise<boolean> {
    try {
      await redis[method](key, ...value)
      return true
    } catch (e) {
      console.error('Redis InsertList Error', e)
      return false
    }
  }

  async getList(key: string, start: number, stop: number): Promise<string[]> {
    try {
      const values = await redis.lrange(key, start, stop)
      return values
    } catch (e) {
      console.error('Redis GetList Error', e)
      return []
    }
  }

  async totalList(key: string): Promise<number> {
    try {
      const length = await redis.llen(key)
      return length
    } catch (e) {
      console.error('Redis TotalList Error', e)
      return 0
    }
  }

  async removeItemList(
    key: string,
    method: 'rpop' | 'lpop',
  ): Promise<string | null> {
    try {
      const value = await redis[method](key)
      return value
    } catch (e) {
      console.error('Redis RemoveItemList Error', e)
      return null
    }
  }

  async removeItemListByValue(key: string, value: string): Promise<boolean> {
    try {
      await redis.lrem(key, 0, value)
      return true
    } catch (e) {
      console.error('Redis RemoveItemListByValue Error', e)
      return false
    }
  }

  // ========================
  // SET METHODS
  // ========================

  async addToSet(key: string, members: string[]): Promise<boolean> {
    try {
      await redis.sadd(key, ...members)
      return true
    } catch (e) {
      console.error('Redis AddToSet Error', e)
      return false
    }
  }

  async getSet(key: string): Promise<string[]> {
    try {
      const members = await redis.smembers(key)
      return members
    } catch (e) {
      console.error('Redis GetSet Error', e)
      return []
    }
  }

  async removeFromSet(key: string, members: string[]): Promise<boolean> {
    try {
      await redis.srem(key, ...members)
      return true
    } catch (e) {
      console.error('Redis RemoveFromSet Error', e)
      return false
    }
  }

  async isMemberOfSet(key: string, member: string): Promise<boolean> {
    try {
      const result = await redis.sismember(key, member)
      return result === 1
    } catch (e) {
      console.error('Redis IsMemberOfSet Error', e)
      return false
    }
  }

  // ========================
  // HASH METHODS
  // ========================

  async setHash(key: string, field: string, value: string): Promise<boolean> {
    try {
      await redis.hset(key, field, value)
      return true
    } catch (e) {
      console.error('Redis SetHash Error', e)
      return false
    }
  }

  async getHash(key: string, field: string): Promise<string | null> {
    try {
      const value = await redis.hget(key, field)
      return value
    } catch (e) {
      console.error('Redis GetHash Error', e)
      return null
    }
  }

  async getHashAll(key: string): Promise<Record<string, string>> {
    try {
      const hash = await redis.hgetall(key)
      return hash
    } catch (e) {
      console.error('Redis GetHashAll Error', e)
      return {}
    }
  }

  async deleteHashField(key: string, field: string): Promise<boolean> {
    try {
      await redis.hdel(key, field)
      return true
    } catch (e) {
      console.error('Redis DeleteHashField Error', e)
      return false
    }
  }
}
