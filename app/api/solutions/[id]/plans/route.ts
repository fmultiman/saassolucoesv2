import { type NextRequest, NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

// GET /api/solutions/[id]/plans - Buscar planos disponíveis para uma solução específica
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const solutionId = Number.parseInt(params.id, 10)
    if (isNaN(solutionId)) {
      return NextResponse.json({ error: "ID da solução inválido" }, { status: 400 })
    }

    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get("activeOnly") === "true"

    const supabase = createServiceRoleClient()

    // Buscar as associações entre a solução e os planos
    const { data: planSolutions, error: planError } = await supabase
      .from("plan_solutions")
      .select("plan_id, custom_price, custom_limits")
      .eq("solution_id", solutionId)

    if (planError) {
      console.error("Erro ao buscar associações da solução:", planError)
      return NextResponse.json({ error: "Erro ao buscar associações da solução" }, { status: 500 })
    }

    if (!planSolutions || planSolutions.length === 0) {
      return NextResponse.json([])
    }

    // Extrair os IDs dos planos
    const planIds = planSolutions.map((ps) => ps.plan_id)

    // Buscar os planos correspondentes
    let query = supabase.from("plans").select("*").in("id", planIds)

    // Se activeOnly for true, filtrar apenas planos ativos
    if (activeOnly) {
      query = query.eq("is_active", true)
    }

    const { data: plans, error: plansError } = await query.order("price")

    if (plansError) {
      console.error("Erro ao buscar planos da solução:", plansError)
      return NextResponse.json({ error: "Erro ao buscar planos da solução" }, { status: 500 })
    }

    // Combinar as informações dos planos com as informações personalizadas da solução
    const enrichedPlans = plans.map((plan) => {
      const planSolution = planSolutions.find((ps) => ps.plan_id === plan.id)
      return {
        ...plan,
        custom_price: planSolution?.custom_price || null,
        custom_limits: planSolution?.custom_limits || null,
      }
    })

    return NextResponse.json(enrichedPlans)
  } catch (error) {
    console.error("Erro ao buscar planos da solução:", error)
    return NextResponse.json({ error: "Erro ao buscar planos da solução" }, { status: 500 })
  }
}
