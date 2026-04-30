import type { User } from "@supabase/supabase-js"
import type { AppUserContext } from "@/types/app-user"
import { syncAuthUserRecord } from "@/lib/users"

export async function ensureUserProfile(authUser: User): Promise<AppUserContext> {
  const syncedContext = await syncAuthUserRecord(authUser)

  return {
    auth: authUser,
    profile: syncedContext.user,
    settingsProfile: syncedContext.profile,
  }
}
