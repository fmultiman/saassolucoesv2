import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Prefixos de rotas client-side (dashboard do cliente)
  const clientPrefixes = [
    "dashboard",
    "conta",
    "configuracoes",
    "minhas-solucoes",
    "assinatura",
    "metricas",
    "interacoes",
    "proximos-envios",
    "ajuda",
    "perfil",
    "solucao",
    "solucoes",
    "onboarding",
  ]
  const isClientRoute = clientPrefixes.some((prefix) => pathname.startsWith(`/${prefix}`))

  // Rotas que não precisam de autenticação
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/blog",
    "/expansao",
    "/auth/verify",
    "/auth/reset-password",
    "/recuperar-senha",
  ]
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  // Rotas específicas de admin
  const isAdminRoute = pathname.startsWith("/admin")
  const isAdminLoginRoute = pathname === "/login/admin"

  // Redirecionamento para verificação de email
  // Se a URL contém ?code=... (Supabase confirmation link)
  if (request.nextUrl.searchParams.has("code")) {
    return NextResponse.redirect(new URL("/auth/verify", request.url))
  }

  // Se for uma rota pública, permite o acesso sem verificação adicional
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Se for uma rota de API ou arquivos estáticos, permite o acesso sem verificação adicional
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next()
  }

  const res = NextResponse.next()

  try {
    // Criar cliente Supabase para o middleware
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string): string | undefined {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options?: Record<string, any>): void {
            if (typeof (request.cookies as any).set === "function") {
              (request.cookies as any).set({ name, value, ...options })
            }
          },
          remove(name: string, options?: Record<string, any>): void {
            if (typeof (request.cookies as any).set === "function") {
              (request.cookies as any).set({ name, value: "", ...options })
            }
          },
        },
      },
    )

    // Verificar se o usuário está autenticado
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Se não estiver autenticado e tentar acessar rota protegida
    if (!session) {
      if (isAdminRoute) {
        return NextResponse.redirect(new URL("/login/admin", request.url))
      }
      if (isClientRoute) {
        return NextResponse.redirect(new URL("/login", request.url))
      }
      // Se não for rota protegida nem pública, permite o acesso
      return res
    }

    // Buscar user_type diretamente do metadata
    const userType = session.user.user_metadata?.user_type

    // Se estiver autenticado, verificar o tipo de usuário
    if (isAdminRoute && userType !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // Cliente tentando acessar login de admin
    if (isAdminLoginRoute && userType === "client") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    if (isClientRoute && userType !== "client") {
      return NextResponse.redirect(new URL("/admin", request.url))
    }

    const redirectByRole = {
      admin: "/admin",
      client: "/dashboard",
    }
    if (["/login", "/signup"].includes(pathname)) {
      return NextResponse.redirect(new URL(redirectByRole[userType as keyof typeof redirectByRole] || "/", request.url))
    }

    return res
  } catch (error) {
    console.error("Erro no middleware:", error)
    // Em caso de erro, permitir o acesso para evitar loops de redirecionamento
    return res
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
