import { getCurrentUser } from "@/lib/auth/getCurrentUser"
import { requireAdmin } from "@/lib/auth/requireAdmin"
import { requireUser } from "@/lib/auth/requireUser"
import { apiErrorResponse, forbiddenError } from "@/lib/errors"

export async function getCurrentApiUser() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return { user: null, userType: null }
  }

  return {
    user: currentUser.auth,
    userType: currentUser.profile.user_type || "client",
    profile: currentUser.profile,
  }
}

export async function requireAdminApiUser() {
  try {
    await requireAdmin()
    return null
  } catch (error) {
    return apiErrorResponse(error)
  }
}

export async function requireSelfOrAdminApiUser(userId: string) {
  try {
    const currentUser = await requireUser()

    if (currentUser.profile.id !== userId && currentUser.profile.user_type !== "admin") {
      throw forbiddenError()
    }

    return null
  } catch (error) {
    return apiErrorResponse(error)
  }
}
