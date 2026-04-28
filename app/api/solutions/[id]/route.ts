import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { requireAdminApiUser } from "@/lib/api-auth"
import { type NextRequest, NextResponse } from "next/server"

// GET - Buscar uma solução por ID
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase.from("solutions").select("*").eq("id", id).single()

    if (error) {
      console.error(`Erro ao buscar solução ${id}:`, error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// PUT - Atualizar uma solução
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdminApiUser()
  if (authError) return authError

  try {
    const { id } = await params
    const body = await request.json()

    const supabase = createServiceRoleClient()
    const { data, error } = await supabase.from("solutions").update(body).eq("id", id).select().single()

    if (error) {
      console.error(`Erro ao atualizar solução ${id}:`, error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// DELETE - Excluir uma solução
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdminApiUser()
  if (authError) return authError

  try {
    const { id } = await params
    const supabase = createServiceRoleClient()
    const { error } = await supabase.from("solutions").delete().eq("id", id)

    if (error) {
      console.error(`Erro ao excluir solução ${id}:`, error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
