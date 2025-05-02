import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { getCurrentUser } from "@/lib/session"

export async function GET(request: Request) {
  try {
    // Verificar se o usuário é admin
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Extrair parâmetros da URL
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const status = searchParams.get("status") // "pending" ou "verified"

    const supabase = createServiceRoleClient()
    let query = supabase.from("email_verification").select("*")

    // Filtrar por usuário se fornecido
    if (userId) {
      query = query.eq("user_id", userId)
    }

    // Filtrar por status se fornecido
    if (status === "pending") {
      query = query.eq("verified", false)
    } else if (status === "verified") {
      query = query.eq("verified", true)
    }

    // Ordenar por data de criação (mais recentes primeiro)
    query = query.order("created_at", { ascending: false })

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error("Erro ao buscar verificações de email:", error)
    return NextResponse.json({ error: error.message || "Erro ao processar solicitação" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    // Verificar se o usuário é admin
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Extrair ID do token da URL
    const { searchParams } = new URL(request.url)
    const tokenId = searchParams.get("id")

    if (!tokenId) {
      return NextResponse.json({ error: "ID do token não fornecido" }, { status: 400 })
    }

    const supabase = createServiceRoleClient()
    const { error } = await supabase.from("email_verification").delete().eq("id", tokenId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Erro ao excluir verificação de email:", error)
    return NextResponse.json({ error: error.message || "Erro ao processar solicitação" }, { status: 500 })
  }
}
