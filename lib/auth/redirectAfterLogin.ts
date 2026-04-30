import type { AppUser, UserRow } from "@/types/app-user"

type RedirectOptions = {
  adminRedirectTo?: string | null
}

function getUserProfile(input: AppUser | UserRow) {
  return "profile" in input ? input.profile : input
}

export function redirectAfterLogin(input: AppUser | UserRow, options: RedirectOptions = {}) {
  const profile = getUserProfile(input)

  if (profile.user_type === "admin") {
    return options.adminRedirectTo || "/admin"
  }

  if (!profile.onboarding_completed) {
    return "/onboarding"
  }

  return "/dashboard"
}
