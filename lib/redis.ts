import { Redis } from "@upstash/redis"

// Singleton pattern para o cliente Redis
let redisClient: Redis | null = null

export function getRedisClient() {
  if (!redisClient) {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || "",
      token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
    })
  }
  return redisClient
}

// Funções de utilidade para operações comuns
export async function cacheData<T>(key: string, data: T, expirationInSeconds = 3600): Promise<void> {
  const redis = getRedisClient()
  await redis.set(key, JSON.stringify(data), { ex: expirationInSeconds })
}

export async function getCachedData<T>(key: string): Promise<T | null> {
  const redis = getRedisClient()
  const data = await redis.get<string>(key)

  if (!data) return null

  try {
    return JSON.parse(data) as T
  } catch (error) {
    console.error("Erro ao fazer parse dos dados em cache:", error)
    return null
  }
}

export async function invalidateCache(key: string): Promise<void> {
  const redis = getRedisClient()
  await redis.del(key)
}

export async function invalidateCachePattern(pattern: string): Promise<void> {
  const redis = getRedisClient()
  const keys = await redis.keys(pattern)

  if (keys.length > 0) {
    await redis.del(...keys)
  }
}
