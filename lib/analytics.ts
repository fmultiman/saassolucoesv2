import { getRedisClient } from "./redis"

type EventType = "pageview" | "click" | "signup" | "login" | "purchase" | "error"

interface AnalyticsEvent {
  type: EventType
  path: string
  userId?: string
  metadata?: Record<string, any>
  timestamp: number
}

export async function trackEvent(event: Omit<AnalyticsEvent, "timestamp">) {
  try {
    const redis = getRedisClient()
    const timestamp = Date.now()

    const fullEvent: AnalyticsEvent = {
      ...event,
      timestamp,
    }

    // Adicionar evento à lista de eventos
    await redis.lpush("analytics:events", JSON.stringify(fullEvent))

    // Manter apenas os últimos 10000 eventos
    await redis.ltrim("analytics:events", 0, 9999)

    // Incrementar contadores
    await redis.incr(`analytics:count:${event.type}`)
    await redis.incr(`analytics:count:${event.type}:${getDateKey()}`)

    // Se tiver userId, rastrear por usuário
    if (event.userId) {
      await redis.lpush(`analytics:user:${event.userId}`, JSON.stringify(fullEvent))
      await redis.ltrim(`analytics:user:${event.userId}`, 0, 99) // Manter últimos 100 eventos por usuário
    }

    // Rastrear caminhos populares
    await redis.zincrby("analytics:popular_paths", 1, event.path)

    return true
  } catch (error) {
    console.error("Erro ao rastrear evento:", error)
    return false
  }
}

export async function getPopularPaths(limit = 10) {
  const redis = getRedisClient()
  return redis.zrange("analytics:popular_paths", 0, limit - 1, { rev: true, withScores: true })
}

export async function getEventCounts(eventType: EventType, days = 7) {
  const redis = getRedisClient()
  const results: Record<string, number> = {}

  // Obter contagens para os últimos X dias
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const key = getDateKey(date)

    const count = (await redis.get<number>(`analytics:count:${eventType}:${key}`)) || 0
    results[key] = count
  }

  return results
}

export async function getUserEvents(userId: string, limit = 20) {
  const redis = getRedisClient()
  const events = await redis.lrange<string>(`analytics:user:${userId}`, 0, limit - 1)

  return events.map((event) => JSON.parse(event))
}

// Função auxiliar para obter chave de data no formato YYYY-MM-DD
function getDateKey(date = new Date()) {
  return date.toISOString().split("T")[0]
}
