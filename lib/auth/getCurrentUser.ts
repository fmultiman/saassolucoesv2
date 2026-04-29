import { cookies } from "next/headers"
import type { User } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/types"
import { createServerClient } from "@/lib/supabase/server"
import { syncAuthUserRecord } from "@/lib/users"

type PublicUserRow = Database["public"]["Tables"]["users"]["Row"]
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"]

export type CurrentUserContext = {
  authUser: User
  user: PublicUserRow
  profile: ProfileRow | null
}

export async function getCurrentUser(): Promise<CurrentUserContext | null> {
  const supabase = createServerClient(await cookies())
  const {
    data: { user: authUser },
    error,
  } = await supabase.auth.getUser()

  if (error || !authUser) {
    return null
  }

  const syncedContext = await syncAuthUserRecord(authUser)

  return {
    authUser,
    user: syncedContext.user,
    profile: syncedContext.profile,
  }
}
