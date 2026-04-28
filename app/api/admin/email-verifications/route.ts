import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { requireAdminApiUser } from "@/lib/api-auth"

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
  } catch (error: any) {
    console.error("Erro ao buscar verificacoes de email:", error)
    return NextResponse.json({ error: error.message || "Erro ao processar solicitacao" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const authError = await requireAdminApiUser()
    if (authError) return authError

    const { searchParams } = new URL(request.url)
    const tokenId = searchParams.get("id")

    if (!tokenId) {
      return NextResponse.json({ error: "ID do token nao fornecido" }, { status: 400 })
    }

    const supabase = createServiceRoleClient()
    const { error } = await supabase.from("email_verification").delete().eq("id", tokenId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Erro ao excluir verificacao de email:", error)
    return NextResponse.json({ error: error.message || "Erro ao processar solicitacao" }, { status: 500 })
  }
}
