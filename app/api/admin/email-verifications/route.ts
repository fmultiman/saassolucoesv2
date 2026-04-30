import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { requireAdminApiUser } from "@/lib/api-auth"
import { apiErrorResponse, badRequestError, logApiError } from "@/lib/errors"

export async function GET(request: Request) {
  try {
    const authError = await requireAdminApiUser()
    if (authError) return authError

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const status = searchParams.get("status")

    const supabase = createServiceRoleClient()
    let query = supabase.from("email_verification").select("*")

    if (userId) {
      query = query.eq("user_id", userId)
    }

    if (status === "pending") {
      query = query.eq("verified", false)
    } else if (status === "verified") {
      query = query.eq("verified", true)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    logApiError("api/admin/email-verifications GET", error)
    return apiErrorResponse(error, "Erro ao processar solicitacao")
  }
}

export async function DELETE(request: Request) {
  try {
    const authError = await requireAdminApiUser()
    if (authError) return authError

    const { searchParams } = new URL(request.url)
    const tokenId = searchParams.get("id")

    if (!tokenId) {
      throw badRequestError("ID do token nao fornecido", undefined, "EMAIL_VERIFICATION_ID_REQUIRED")
    }

    const supabase = createServiceRoleClient()
    const { error } = await supabase.from("email_verification").delete().eq("id", tokenId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    logApiError("api/admin/email-verifications DELETE", error)
    return apiErrorResponse(error, "Erro ao processar solicitacao")
  }
}
