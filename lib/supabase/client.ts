import { createBrowserClient } from "@supabase/ssr"

// Singleton pattern para evitar múltiplas instâncias do GoTrueClient
let supabase: ReturnType<typeof createBrowserClient> | undefined = undefined

if (typeof window !== "undefined") {
  if (!(window as any).supabaseSingleton) {
    (window as any).supabaseSingleton = createBrowserClient(
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
            if (options.maxAge) {
              cookie += `; Max-Age=${options.maxAge}`
            }
            if (options.path) {
              cookie += `; Path=${options.path}`
            }
            if (options.sameSite) {
              cookie += `; SameSite=${options.sameSite}`
            }
            if (options.domain) {
              cookie += `; Domain=${options.domain}`
            }
            if (options.secure) {
              cookie += "; Secure"
            }
            document.cookie = cookie
          },
          remove(name, options) {
            this.set(name, "", { ...options, maxAge: -1 })
          },
        },
        auth: {
          flowType: "implicit",
          detectSessionInUrl: true,
          persistSession: true,
          autoRefreshToken: true,
        },
      }
    )
  }
  supabase = (window as any).supabaseSingleton
}

export { supabase }
