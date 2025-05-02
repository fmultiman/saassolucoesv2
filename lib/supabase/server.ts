import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "./types"

// Configuração padrão de cookies para todos os clientes
const cookieOptions = {
  name: "sb-auth-token",
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 dias
  domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined,
}

/**
 * Cria um cliente Supabase para uso em componentes do servidor
 * @param cookieStore - Objeto cookies de next/headers
 * @returns Cliente Supabase configurado para o servidor
 */
export function createServerClient(cookieStore: ReturnType<typeof cookies>) {
  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options })
        },
      },
      cookieOptions,
    },
  )
}

/**
 * @deprecated Use createServerClient(cookies()) em vez disso
 * Mantido para compatibilidade com código existente
 */
export function createClient() {
  console.warn("Deprecated: Use createServerClient(cookies()) instead of createClient() for server components")
  const cookieStore = cookies()
  return createServerClient(cookieStore)
}
