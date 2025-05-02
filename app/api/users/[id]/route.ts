import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const supabase = createServiceRoleClient()

    const { data, error } = await supabase
      .from("users")
      .select("id, email, name, plan_id, created_at, updated_at")
      .eq("id", id)
      .single()

    if (error) {
      console.error("Erro ao buscar usuário:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Exceção ao buscar usuário:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
