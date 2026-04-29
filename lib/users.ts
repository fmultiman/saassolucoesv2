import type { User } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/types"
import { DEFAULT_PLAN } from "@/lib/constants"
import { badRequestError } from "@/lib/errors"
import { resolvePlanFromDatabase } from "@/lib/plan-utils"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

type PublicUserRow = Database["public"]["Tables"]["users"]["Row"]
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"]

type SyncAuthUserOptions = {
  email?: string
  name?: string | null
  userType?: string | null
  plan?: string | null
  status?: string | null
  onboardingCompleted?: boolean
}

type SyncedUserContext = {
  user: PublicUserRow
  profile: ProfileRow | null
}

function asNonEmptyString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

export function normalizeEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase()

  if (!normalizedEmail) {
    throw badRequestError("Email invalido")
  }

  return normalizedEmail
}

export async function getUserByEmail(email: string) {
  const supabase = createServiceRoleClient()
  const normalizedEmail = normalizeEmail(email)

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", normalizedEmail)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}

export async function userExists(email: string) {
  const existingUser = await getUserByEmail(email)
  return !!existingUser
}

export async function syncAuthUserRecord(authUser: User, options: SyncAuthUserOptions = {}): Promise<SyncedUserContext> {
  const supabase = createServiceRoleClient()
  const normalizedEmail = normalizeEmail(options.email ?? authUser.email ?? "")

  const { data: existingUser, error: existingUserError } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .maybeSingle()

  if (existingUserError) {
    throw existingUserError
  }

  const metadata = authUser.user_metadata ?? {}
  const finalUserType =
    options.userType ??
    existingUser?.user_type ??
    asNonEmptyString(metadata.user_type) ??
    asNonEmptyString(metadata.tipo) ??
    "client"

  const finalName =
    options.name ??
    existingUser?.name ??
    asNonEmptyString(metadata.name) ??
    normalizedEmail

  const candidatePlan =
    options.plan ??
    existingUser?.plan ??
    asNonEmptyString(metadata.plan) ??
    DEFAULT_PLAN

  const resolvedPlan = await resolvePlanFromDatabase(candidatePlan)
  const finalPlanCode = resolvedPlan.code || DEFAULT_PLAN
  const finalPlanId = resolvedPlan.id ?? existingUser?.plan_id ?? null
  const finalStatus = options.status ?? existingUser?.status ?? "active"
  const finalOnboardingCompleted = options.onboardingCompleted ?? existingUser?.onboarding_completed ?? false

  const { data: syncedUser, error: userUpsertError } = await supabase
    .from("users")
    .upsert(
      {
        id: authUser.id,
        email: normalizedEmail,
        name: finalName,
        user_type: finalUserType,
        status: finalStatus,
        plan: finalPlanCode,
        plan_id: finalPlanId,
        onboarding_completed: finalOnboardingCompleted,
        last_sign_in_at: authUser.last_sign_in_at ?? existingUser?.last_sign_in_at ?? null,
      },
      { onConflict: "id" },
    )
    .select("*")
    .single()

  if (userUpsertError) {
    throw userUpsertError
  }

  const { data: syncedProfile, error: profileUpsertError } = await supabase
    .from("profiles")
    .upsert(
      {
        id: authUser.id,
        email: normalizedEmail,
        name: finalName,
      },
      { onConflict: "id" },
    )
    .select("*")
    .maybeSingle()

  if (profileUpsertError) {
    throw profileUpsertError
  }

  return {
    user: syncedUser,
    profile: syncedProfile ?? null,
  }
}
