import { createClient as createSupabaseServerClient } from "@supabase/supabase-js"
import type { cookies } from "next/headers"
import type { Database } from "./types"

/**
 * Creates a Supabase client for use in server components.
 *
 * @param cookieStore - The Next.js cookie store.
 * @returns A Supabase client configured for server-side usage.
 */
export function createClient(cookieStore: ReturnType<typeof cookies>) {
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
    },
  )
}
