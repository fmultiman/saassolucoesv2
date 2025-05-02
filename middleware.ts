import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rotas que não precisam de autenticação
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/blog",
    "/marketplace",
    "/recursos-adicionais",
    "/auth/verify",
    "/auth/reset-password",
    "/recuperar-senha",
  ]
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  // Rotas específicas de admin
  const isAdminRoute = pathname.startsWith("/admin")
  const isAdminLoginRoute = pathname === "/login/admin"

  // Rotas específicas de cliente (usuário logado)
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
    pathname.startsWith("/expansao") ||
    pathname.startsWith("/perfil") ||
    pathname.startsWith("/solucao") ||
    pathname.startsWith("/solucoes") ||
    pathname.startsWith("/onboarding")

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
          get(name) {
            return request.cookies.get(name)?.value
          },
          set(name, value, options) {
            request.cookies.set({
              name,
              value,
              ...options,
            })
            res.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name, options) {
            request.cookies.set({
              name,
              value: "",
              ...options,
            })
            res.cookies.set({
              name,
              value: "",
              ...options,
            })
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

    // Se estiver autenticado, verificar o tipo de usuário
    const { data: userData, error } = await supabase
      .from("users")
      .select("user_type")
      .eq("id", session.user.id)
      .single()

    // Se houver erro ao buscar o tipo de usuário, permitir acesso para evitar loops
    if (error) {
      console.error("Erro ao verificar tipo de usuário:", error)
      return res
    }

    const userType = userData?.user_type

    // Se estiver autenticado mas tentar acessar rota incompatível com seu tipo
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

    // Se estiver autenticado e tentar acessar página de login
    if (pathname === "/login" || pathname === "/signup") {
      if (userType === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url))
      }
      if (userType === "client") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
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
