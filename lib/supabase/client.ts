import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./types"

let supabaseInstance: SupabaseClient<Database> | null = null

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.")
  }

  return { supabaseUrl, supabaseAnonKey }
}

export const createClient = (): SupabaseClient<Database> => {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig()

  if (typeof window === "undefined") {
    return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: "pkce",
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  }

  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name) {
          return document.cookie
            .split("; ")
            .find((cookie) => cookie.startsWith(`${name}=`))
            ?.split("=")[1]
        },
        set(name, value, options) {
          let cookie = `${name}=${value}`
          if (options.maxAge) cookie += `; Max-Age=${options.maxAge}`
          if (options.path) cookie += `; Path=${options.path}`
          if (options.sameSite) cookie += `; SameSite=${options.sameSite}`
          if (options.domain) cookie += `; Domain=${options.domain}`
          if (options.secure) cookie += "; Secure"
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
    })
  }

  return supabaseInstance
}

export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_target, prop, receiver) {
    return Reflect.get(createClient(), prop, receiver)
  },
})

export const clearSupabaseClient = () => {
  supabaseInstance = null
}
