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
    user: currentUser.authUser,
    userType: currentUser.user.user_type || "client",
    profile: currentUser.user,
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

    if (currentUser.user.id !== userId && currentUser.user.user_type !== "admin") {
      throw forbiddenError()
    }

    return null
  } catch (error) {
    return apiErrorResponse(error)
  }
}
