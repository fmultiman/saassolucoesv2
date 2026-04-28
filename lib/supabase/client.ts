import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./types"
import { getSupabasePublicConfig } from "./env"

let supabaseInstance: SupabaseClient<Database> | null = null

export const createClient = (): SupabaseClient<Database> => {
  const { supabaseUrl, supabaseKey } = getSupabasePublicConfig()

  if (typeof window === "undefined") {
    return createBrowserClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
        flowType: "pkce",
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  }

  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient<Database>(supabaseUrl, supabaseKey, {
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
