import { cookies } from "next/headers"
import type { AppUserContext } from "@/types/app-user"
import { ensureUserProfile } from "@/lib/auth/ensureUserProfile"
import { createServerClient } from "@/lib/supabase/server"

export type CurrentUserContext = AppUserContext

export async function getCurrentUser(): Promise<AppUserContext | null> {
  const supabase = createServerClient(await cookies())
  const {
    data: { user: authUser },
    error,
  } = await supabase.auth.getUser()

  if (error || !authUser) {
    return null
  }

  return ensureUserProfile(authUser)
}
