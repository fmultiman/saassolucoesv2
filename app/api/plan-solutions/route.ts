import { type NextRequest, NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

// GET /api/plan-solutions - Buscar associações entre planos e soluções
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const planId = searchParams.get("planId")
    const solutionId = searchParams.get("solutionId")

    const supabase = createServiceRoleClient()
    let query = supabase.from("plan_solutions").select("*")

    if (planId) {
      query = query.eq("plan_id", planId)
    }

    if (solutionId) {
      query = query.eq("solution_id", solutionId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Erro ao buscar associações:", error)
      return NextResponse.json({ error: "Erro ao buscar associações" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao buscar associações:", error)
    return NextResponse.json({ error: "Erro ao buscar associações" }, { status: 500 })
  }
}

// POST /api/plan-solutions - Criar uma nova associação entre plano e solução
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { plan_id, solution_id, custom_price, custom_limits } = body

    if (!plan_id || !solution_id) {
      return NextResponse.json({ error: "IDs do plano e da solução são obrigatórios" }, { status: 400 })
    }

    const supabase = createServiceRoleClient()

    // Verificar se a associação já existe
    const { data: existingData, error: existingError } = await supabase
      .from("plan_solutions")
      .select("*")
      .eq("plan_id", plan_id)
      .eq("solution_id", solution_id)
      .maybeSingle()

    if (existingError) {
      console.error("Erro ao verificar associação existente:", existingError)
      return NextResponse.json({ error: "Erro ao verificar associação existente" }, { status: 500 })
    }

    if (existingData) {
      return NextResponse.json({ error: "Esta associação já existe", id: existingData.id }, { status: 409 })
    }

    // Criar nova associação
    const { data, error } = await supabase
      .from("plan_solutions")
      .insert({
        plan_id,
        solution_id,
        custom_price,
        custom_limits,
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar associação:", error)
      return NextResponse.json({ error: "Erro ao criar associação" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao criar associação:", error)
    return NextResponse.json({ error: "Erro ao criar associação" }, { status: 500 })
  }
}
