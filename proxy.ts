import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { getSupabasePublicConfig } from "@/lib/supabase/env"

const publicRoutes = [
  "/",
  "/signup",
  "/blog",
  "/marketplace",
  "/expansao",
  "/recursos-adicionais",
  "/auth/verify",
  "/auth/reset-password",
  "/recuperar-senha",
]

const authRoutes = ["/login", "/login/admin"]

function isRoute(pathname: string, routes: string[]) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`))
}

function isStaticOrApi(pathname: string) {
  return pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname.includes(".") || pathname.startsWith("/favicon")
}

function getRedirectPath(pathname: string, userType?: string | null) {
  const isAdminRoute = pathname.startsWith("/admin")
  const isClientRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/conta") ||
    pathname.startsWith("/configuracoes") ||
    pathname.startsWith("/minhas-solucoes") ||
    pathname.startsWith("/assinatura") ||
    pathname.startsWith("/metricas") ||
    pathname.startsWith("/interacoes") ||
    pathname.startsWith("/proximos-envios") ||
    pathname.startsWith("/ajuda") ||
    pathname.startsWith("/perfil") ||
    pathname.startsWith("/solucao") ||
    pathname.startsWith("/solucoes") ||
    pathname.startsWith("/onboarding")

  if (isAdminRoute && userType !== "admin") return "/dashboard"
  if (isClientRoute && userType === "admin") return "/admin"
  if (authRoutes.includes(pathname) && userType === "admin") return "/admin"
  if (authRoutes.includes(pathname) && userType === "client") return "/dashboard"

  return null
}

function getUnauthenticatedRedirectPath(pathname: string) {
  if (isRoute(pathname, publicRoutes) || isRoute(pathname, authRoutes)) return null
  if (pathname.startsWith("/admin")) return "/login/admin"

  const protectedClientRoutes =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/conta") ||
    pathname.startsWith("/configuracoes") ||
    pathname.startsWith("/minhas-solucoes") ||
    pathname.startsWith("/assinatura") ||
    pathname.startsWith("/metricas") ||
    pathname.startsWith("/interacoes") ||
    pathname.startsWith("/proximos-envios") ||
    pathname.startsWith("/ajuda") ||
    pathname.startsWith("/perfil") ||
    pathname.startsWith("/solucao") ||
    pathname.startsWith("/solucoes") ||
    pathname.startsWith("/onboarding")

  return protectedClientRoutes ? "/login" : null
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isStaticOrApi(pathname)) {
    return NextResponse.next()
  }

  let response = NextResponse.next({ request })

  const redirectWithCookies = (path: string) => {
    const redirectResponse = NextResponse.redirect(new URL(path, request.url))
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie)
    })
    return redirectResponse
  }

  try {
    const { supabaseUrl, supabaseKey } = getSupabasePublicConfig()
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })

          response = NextResponse.next({ request })

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      const redirectPath = getUnauthenticatedRedirectPath(pathname)
      if (redirectPath) return redirectWithCookies(redirectPath)
      return response
    }

    const { data: userData } = await supabase.from("users").select("user_type").eq("id", user.id).maybeSingle()
    const userType = userData?.user_type || user.user_metadata?.user_type || user.user_metadata?.tipo || "client"
    const redirectPath = getRedirectPath(pathname, userType)

    if (redirectPath) {
      return redirectWithCookies(redirectPath)
    }

    return response
  } catch (error) {
    console.error("Erro no proxy de autenticação:", error)

    if (!isRoute(pathname, publicRoutes) && !isRoute(pathname, authRoutes)) {
      return pathname.startsWith("/admin") ? redirectWithCookies("/login/admin") : redirectWithCookies("/login")
    }

    return response
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
