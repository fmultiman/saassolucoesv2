import { type NextRequest, NextResponse } from "next/server"
import { getRedisClient } from "./redis"

type RateLimitOptions = {
  limit: number
  window: number // em segundos
  identifier?: string // identificador personalizado (ex: rota específica)
}

export async function rateLimit(request: NextRequest, options: RateLimitOptions = { limit: 10, window: 60 }) {
  const ip = request.ip || "127.0.0.1"
  const { limit, window, identifier = "" } = options

  const redis = getRedisClient()
  const key = `rate-limit:${identifier}:${ip}`

  // Obter contagem atual
  const count = (await redis.get<number>(key)) || 0

  // Se excedeu o limite
  if (count >= limit) {
    return NextResponse.json(
      {
        error: "Too many requests",
        message: "Por favor, tente novamente mais tarde",
        retryAfter: window,
      },
      {
        status: 429,
        headers: {
          "Retry-After": window.toString(),
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": (Math.floor(Date.now() / 1000) + window).toString(),
        },
      },
    )
  }

  // Incrementar contagem
  if (count === 0) {
    await redis.set(key, 1, { ex: window })
  } else {
    await redis.incr(key)
  }

  // Adicionar headers de rate limit
  const remaining = limit - count - 1
  const headers = {
    "X-RateLimit-Limit": limit.toString(),
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": (Math.floor(Date.now() / 1000) + window).toString(),
  }

  return { headers, remaining }
}
