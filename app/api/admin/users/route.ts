import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/requireAdmin"
import { apiErrorResponse, logApiError } from "@/lib/errors"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export async function GET() {
  try {
    await requireAdmin()

    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from("users")
      .select("id, email, name, user_type, plan, plan_id, onboarding_completed, status, created_at, updated_at, last_sign_in_at, active_solutions")
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(data ?? [])
  } catch (error) {
    logApiError("api/admin/users GET", error)
    return apiErrorResponse(error)
  }
}
