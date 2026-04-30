import { supabase } from "@/lib/supabase/client"
import { getAuthRedirectUrls } from "@/lib/supabase/auth-helpers"

type MagicLinkOptions = {
  email: string
  shouldCreateUser?: boolean
  data?: Record<string, unknown>
}

export async function startGoogleOAuth() {
  const { emailRedirectTo } = getAuthRedirectUrls()

  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: emailRedirectTo,
    },
  })
}

export async function sendMagicLink({ email, shouldCreateUser = false, data }: MagicLinkOptions) {
  const { emailRedirectTo } = getAuthRedirectUrls()

  return supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo,
      shouldCreateUser,
      data,
    },
  })
}
