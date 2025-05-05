import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./types"

let supabaseInstance: SupabaseClient<Database> | null = null

export const createClient = (): SupabaseClient<Database> => {
  if (typeof window === "undefined") {
    // No servidor sempre cria uma nova instância
    return createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          flowType: "pkce",
          detectSessionInUrl: true,
          persistSession: true,
          autoRefreshToken: true,
        },
      }
    )
  }

  // No cliente, usa singleton
  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return document.cookie
              .split("; ")
              .find((c) => c.startsWith(`${name}=`))
              ?.split("=")[1]
          },
          set(name, value, options) {
            let cookie = `${name}=${value}`
            if (options.maxAge) cookie += `; Max-Age=${options.maxAge}`
            if (options.path) cookie += `; Path=${options.path}`
            if (options.sameSite) cookie += `; SameSite=${options.sameSite}`
            if (options.domain) cookie += `; Domain=${options.domain}`
            if (options.secure) cookie += `; Secure`
            document.cookie = cookie
          },
          remove(name, options) {
            this.set(name, "", { ...options, maxAge: -1 })
          },
        },
        auth: {
          flowType: "pkce",
          detectSessionInUrl: true,
          persistSession: true,
          autoRefreshToken: true,
        },
      }
    )
  }

  return supabaseInstance
}

// Exporta diretamente como 'supabase' para manter compatibilidade com suas páginas
export const supabase = createClient()

// Função para limpar o singleton — útil em logout
export const clearSupabaseClient = () => {
  supabaseInstance = null
}
