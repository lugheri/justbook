/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ICacheRepository {
  // String Methods
  get(key: string): Promise<string | null>
  set(key: string, value: string, expire?: number): Promise<boolean>
  setMultiple(
    keysValues: { key: string; value: string; expire?: number }[],
  ): Promise<boolean>
  setIfNotExists(key: string, value: string, expire?: number): Promise<boolean>
  getOrSet(
    key: string,
    fallback: () => Promise<string>,
    expire?: number,
  ): Promise<string>
  getOrSetWithNull(
    key: string,
    fallback: () => Promise<string | null>,
    expire?: number,
  ): Promise<string | null>
  getAndDelete(key: string): Promise<string | null>
  append(key: string, value: string): Promise<number>

  // Key Management
  delete(key: string): Promise<boolean>
  deleteKeysByPrefix(prefix: string): Promise<boolean>
  deleteAll(): Promise<boolean>
  exists(key: string): Promise<boolean>
  expire(key: string, seconds: number): Promise<boolean>
  ttl(key: string): Promise<number>

  // Pattern Methods
  keys(pattern: string): Promise<string[]>
  scanKey(prefix: string): Promise<{ keys: string[]; values: any[] }>
  fetchFirstNKeys(pattern: string, limit: number): Promise<any[]>

  // Counter Methods
  increment(key: string, amount?: number): Promise<number>
  decrement(key: string, amount?: number): Promise<number>

  // List Methods
  insertList(
    key: string,
    value: string[],
    method: 'lpush' | 'rpush',
  ): Promise<boolean>
  getList(key: string, start: number, stop: number): Promise<string[]>
  totalList(key: string): Promise<number>
  removeItemList(key: string, method: 'rpop' | 'lpop'): Promise<string | null>
  removeItemListByValue(key: string, value: string): Promise<boolean>

  // Set Methods
  addToSet(key: string, members: string[]): Promise<boolean>
  getSet(key: string): Promise<string[]>
  removeFromSet(key: string, members: string[]): Promise<boolean>
  isMemberOfSet(key: string, member: string): Promise<boolean>

  // Hash Methods
  setHash(key: string, field: string, value: string): Promise<boolean>
  getHash(key: string, field: string): Promise<string | null>
  getHashAll(key: string): Promise<Record<string, string>>
  deleteHashField(key: string, field: string): Promise<boolean>
}
