import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { requireAdminApiUser } from "@/lib/api-auth"
import { NextResponse } from "next/server"

// GET - Listar todos os planos
export async function GET() {
  try {
    const supabase = createServiceRoleClient()

    const { data, error } = await supabase.from("plans").select("*").order("price")

    if (error) {
      console.error("Erro ao buscar planos:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Exceção ao buscar planos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// POST - Criar um novo plano
export async function POST(request: Request) {
  const authError = await requireAdminApiUser()
  if (authError) return authError

  try {
    const body = await request.json()
    const { name, description, price, features } = body

    if (!name || price === undefined) {
      return NextResponse.json({ error: "name e price são obrigatórios" }, { status: 400 })
    }

    const supabase = createServiceRoleClient()

    const { data, error } = await supabase
      .from("plans")
      .insert({
        name,
        description,
        price,
        features,
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar plano:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Exceção ao criar plano:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
