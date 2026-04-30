import { NextResponse } from "next/server"
import { getPopularPaths, getEventCounts } from "@/lib/analytics"
import { rateLimit } from "@/lib/rate-limit"
import { requireAdminApiUser } from "@/lib/api-auth"
import { apiErrorResponse, logApiError } from "@/lib/errors"

export async function GET(request: Request) {
  try {
    const authError = await requireAdminApiUser()
    if (authError) return authError

    const rateLimitResult = await rateLimit(request as any, { limit: 20, window: 60, identifier: "admin-analytics" })

    if (rateLimitResult && !("headers" in rateLimitResult)) {
      return rateLimitResult
    }

    const popularPaths = await getPopularPaths(10)

    const pageviews = await getEventCounts("pageview", 30)
    const signups = await getEventCounts("signup", 30)
    const logins = await getEventCounts("login", 30)
    const errors = await getEventCounts("error", 30)

    return NextResponse.json(
      {
        popularPaths,
        events: {
          pageviews,
          signups,
          logins,
          errors,
        },
      },
      {
        headers: rateLimitResult?.headers,
      },
    )
  } catch (error) {
    logApiError("api/admin/analytics GET", error)
    return apiErrorResponse(error, "Erro ao obter analytics")
  }
}
