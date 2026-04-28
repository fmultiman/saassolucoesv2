import { type NextRequest, NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { requireAdminApiUser } from "@/lib/api-auth"

// GET /api/plan-solutions - Buscar associações entre planos e soluções
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const planId = searchParams.get("planId")
    const solutionId = searchParams.get("solutionId")
    const planIdNumber = planId ? Number.parseInt(planId, 10) : null
    const solutionIdNumber = solutionId ? Number.parseInt(solutionId, 10) : null

    if ((planId && Number.isNaN(planIdNumber)) || (solutionId && Number.isNaN(solutionIdNumber))) {
      return NextResponse.json({ error: "Parametros invalidos" }, { status: 400 })
    }

    const supabase = createServiceRoleClient()
    let query = supabase.from("plan_solutions").select("*")

    if (planId) {
      query = query.eq("plan_id", planIdNumber!)
    }

    if (solutionId) {
      query = query.eq("solution_id", solutionIdNumber!)
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
  const authError = await requireAdminApiUser()
  if (authError) return authError

  try {
    const body = await request.json()
    const { plan_id, solution_id, custom_price, custom_limits } = body
    const planId = Number(plan_id)
    const solutionId = Number(solution_id)

    if (!plan_id || !solution_id || Number.isNaN(planId) || Number.isNaN(solutionId)) {
      return NextResponse.json({ error: "IDs do plano e da solução são obrigatórios" }, { status: 400 })
    }

    const supabase = createServiceRoleClient()

    // Verificar se a associação já existe
    const { data: existingData, error: existingError } = await supabase
      .from("plan_solutions")
      .select("*")
      .eq("plan_id", planId)
      .eq("solution_id", solutionId)
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
        plan_id: planId,
        solution_id: solutionId,
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
