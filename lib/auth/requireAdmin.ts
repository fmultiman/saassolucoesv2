import type { CurrentUserContext } from "@/lib/auth/getCurrentUser"
import { requireUser } from "@/lib/auth/requireUser"
import { forbiddenError } from "@/lib/errors"

export async function requireAdmin(): Promise<CurrentUserContext> {
  const currentUser = await requireUser()

  if (currentUser.user.user_type !== "admin") {
    throw forbiddenError()
  }

  return currentUser
}
