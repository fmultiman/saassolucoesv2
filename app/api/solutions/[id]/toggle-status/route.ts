import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { requireAdminApiUser } from "@/lib/api-auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdminApiUser()
  if (authError) return authError

  try {
    const { id } = await params
    const solutionId = Number.parseInt(id, 10)
    if (Number.isNaN(solutionId)) {
      return NextResponse.json({ error: "ID da solucao invalido" }, { status: 400 })
    }
    const { is_active } = await request.json()

    const supabase = createServiceRoleClient()
    const { data, error } = await supabase.from("solutions").update({ is_active }).eq("id", solutionId).select().single()

    if (error) {
      console.error(`Erro ao atualizar status da solução ${id}:`, error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
