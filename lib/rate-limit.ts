import { type NextRequest, NextResponse } from "next/server"
import { getRedisClient } from "./redis"

type RateLimitOptions = {
  limit: number
  window: number // em segundos
  identifier?: string // identificador personalizado (ex: rota específica)
}

type LegacyRateLimitResult = {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

export async function rateLimit(identifier: string, limit: number, window: number): Promise<LegacyRateLimitResult>
export async function rateLimit(
  request: NextRequest,
  options?: RateLimitOptions,
): Promise<NextResponse | { headers: Record<string, string>; remaining: number }>
export async function rateLimit(
  requestOrIdentifier: NextRequest | string,
  optionsOrLimit: RateLimitOptions | number = { limit: 10, window: 60 },
  legacyWindow?: number,
): Promise<LegacyRateLimitResult | NextResponse | { headers: Record<string, string>; remaining: number }> {
  const isLegacyCall = typeof requestOrIdentifier === "string"
  const request = isLegacyCall ? null : requestOrIdentifier
  const options =
    typeof optionsOrLimit === "number"
      ? { limit: optionsOrLimit, window: legacyWindow || 60, identifier: requestOrIdentifier as string }
      : optionsOrLimit

  const ip = request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request?.headers.get("x-real-ip") || "127.0.0.1"
  const { limit, window, identifier = "" } = options

  const redis = getRedisClient()
  const key = `rate-limit:${identifier}:${ip}`

  // Obter contagem atual
  const count = (await redis.get<number>(key)) || 0

  // Se excedeu o limite
  if (count >= limit) {
    if (isLegacyCall) {
      return {
        success: false,
        limit,
        remaining: 0,
        reset: Math.floor(Date.now() / 1000) + window,
      } satisfies LegacyRateLimitResult
    }

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

  if (isLegacyCall) {
    return {
      success: true,
      limit,
      remaining,
      reset: Math.floor(Date.now() / 1000) + window,
    } satisfies LegacyRateLimitResult
  }

  return { headers, remaining }
}
