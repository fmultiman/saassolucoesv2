import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/requireAdmin"
import { apiErrorResponse, logApiError } from "@/lib/errors"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export async function GET() {
  try {
    await requireAdmin()

    const supabase = createServiceRoleClient()
    const { data, error } = await supabase.from("plans").select("*").order("sort_order").order("price")

    if (error) {
      throw error
    }

    return NextResponse.json(data ?? [])
  } catch (error) {
    logApiError("api/admin/plans GET", error)
    return apiErrorResponse(error)
  }
}
