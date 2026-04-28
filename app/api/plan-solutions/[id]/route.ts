import { type NextRequest, NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { requireAdminApiUser } from "@/lib/api-auth"

// GET /api/plan-solutions/[id] - Buscar uma associação específica
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id, 10)
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const supabase = createServiceRoleClient()
    const { data, error } = await supabase.from("plan_solutions").select("*").eq("id", id).single()

    if (error) {
      console.error(`Erro ao buscar associação com ID ${id}:`, error)
      return NextResponse.json({ error: "Erro ao buscar associação" }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Associação não encontrada" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao buscar associação:", error)
    return NextResponse.json({ error: "Erro ao buscar associação" }, { status: 500 })
  }
}

// PATCH /api/plan-solutions/[id] - Atualizar uma associação específica
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAdminApiUser()
  if (authError) return authError

  try {
    const id = Number.parseInt(params.id, 10)
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const body = await request.json()
    const { custom_price, custom_limits } = body

    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from("plan_solutions")
      .update({
        custom_price,
        custom_limits,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error(`Erro ao atualizar associação com ID ${id}:`, error)
      return NextResponse.json({ error: "Erro ao atualizar associação" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao atualizar associação:", error)
    return NextResponse.json({ error: "Erro ao atualizar associação" }, { status: 500 })
  }
}

// DELETE /api/plan-solutions/[id] - Remover uma associação específica
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAdminApiUser()
  if (authError) return authError

  try {
    const id = Number.parseInt(params.id, 10)
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const supabase = createServiceRoleClient()
    const { error } = await supabase.from("plan_solutions").delete().eq("id", id)

    if (error) {
      console.error(`Erro ao remover associação com ID ${id}:`, error)
      return NextResponse.json({ error: "Erro ao remover associação" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao remover associação:", error)
    return NextResponse.json({ error: "Erro ao remover associação" }, { status: 500 })
  }
}
