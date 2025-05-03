import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"
import type { RequestCookies, ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies"
import type { Database } from "./types"

/**
 * Cria um cliente Supabase para uso em componentes do servidor
 * @param cookies - Objeto cookies de next/headers
 * @returns Cliente Supabase configurado para o servidor
 */
export function createServerClient(cookies: RequestCookies | ResponseCookies) {
  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // Apenas ResponseCookies permite setar cookies
          if (typeof (cookies as ResponseCookies).set === "function") {
            (cookies as ResponseCookies).set({ name, value, ...options })
          }
        },
        remove(name: string, options: any) {
          if (typeof (cookies as ResponseCookies).set === "function") {
            (cookies as ResponseCookies).set({ name, value: "", ...options })
          }
        },
      },
    },
  )
}
