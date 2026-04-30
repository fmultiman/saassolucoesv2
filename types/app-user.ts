import type { User as SupabaseUser } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/types"

export type UserRow = Database["public"]["Tables"]["users"]["Row"]
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"]

export type AppUser = {
  auth: SupabaseUser
  profile: UserRow
}

export type AppUserContext = AppUser & {
  settingsProfile: ProfileRow | null
}
