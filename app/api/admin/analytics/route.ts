import { NextResponse } from "next/server"
import { getPopularPaths, getEventCounts } from "@/lib/analytics"
import { rateLimit } from "@/lib/rate-limit"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export async function GET(request: Request) {
  try {
    // Aplicar rate limiting
    const rateLimitResult = await rateLimit(request as any, { limit: 20, window: 60, identifier: "admin-analytics" })

    if (rateLimitResult && !("headers" in rateLimitResult)) {
      return rateLimitResult
    }

    // Verificar autenticação e permissões
    const supabase = createServiceRoleClient()
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Verificar se é admin
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("user_type")
      .eq("id", user.id)
      .single()

    if (userError || userData?.user_type !== "admin") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    // Obter dados de analytics
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
  } catch (error: any) {
    console.error("Erro ao obter analytics:", error)
    return NextResponse.json({ error: error.message || "Erro ao obter analytics" }, { status: 500 })
  }
}
