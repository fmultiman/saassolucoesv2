import { createClient } from "@supabase/supabase-js"
import { getSupabasePublishableKey, getSupabaseUrl } from "./env"
import { getAuthRedirectUrls } from "./auth-helpers"

const { emailRedirectTo } = getAuthRedirectUrls()

export const SUPABASE_AUTH_CONFIG = {
  redirectTo: emailRedirectTo,
  cookieOptions: {
    name: "sb-auth-token",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  },
  emailRedirectTo,
}

export function createAuthClient() {
  return createClient(getSupabaseUrl() || "", getSupabasePublishableKey() || "", {
    auth: {
      flowType: "pkce",
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
}
