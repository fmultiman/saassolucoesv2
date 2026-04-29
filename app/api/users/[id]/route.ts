import { NextResponse } from "next/server"
import { requireSelfOrAdminApiUser } from "@/lib/api-auth"
import { apiErrorResponse, logApiError, notFoundError } from "@/lib/errors"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const authError = await requireSelfOrAdminApiUser(id)
  if (authError) return authError

  try {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from("users")
      .select("id, email, name, user_type, status, plan, plan_id, onboarding_completed, created_at, updated_at, last_sign_in_at")
      .eq("id", id)
      .maybeSingle()

    if (error) {
      throw error
    }

    if (!data) {
      throw notFoundError("Usuario nao encontrado")
    }

    return NextResponse.json(data)
  } catch (error) {
    logApiError("api/users/[id] GET", error)
    return apiErrorResponse(error)
  }
}
