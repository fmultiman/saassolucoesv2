import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { type NextRequest, NextResponse } from "next/server"

// GET - Buscar todas as soluções
export async function GET() {
  try {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase.from("solutions").select("*").order("name")

    if (error) {
      console.error("Erro ao buscar soluções:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Exceção ao buscar soluções:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// POST - Criar uma nova solução
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const supabase = createServiceRoleClient()
    const { data, error } = await supabase.from("solutions").insert(body).select().single()

    if (error) {
      console.error("Erro ao criar solução:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
