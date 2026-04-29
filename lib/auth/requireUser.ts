import type { CurrentUserContext } from "@/lib/auth/getCurrentUser"
import { getCurrentUser } from "@/lib/auth/getCurrentUser"
import { unauthorizedError } from "@/lib/errors"

export async function requireUser(): Promise<CurrentUserContext> {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    throw unauthorizedError()
  }

  return currentUser
}
