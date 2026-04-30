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
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  }

  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
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
