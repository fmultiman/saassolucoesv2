import { type NextRequest, NextResponse } from "next/server"
import { PlansService } from "@/lib/services/plans-service"
import { requireAdminApiUser } from "@/lib/api-auth"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

// GET /api/plans/[id]/solutions - Buscar soluções associadas a um plano
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const countOnly = searchParams.get("count") === "true"
    const planId = params.id

    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    if (countOnly) {
      // Retornar apenas a contagem de soluções
      const { count, error } = await supabase
        .from("plan_solutions")
        .select("*", { count: "exact", head: true })
        .eq("plan_id", planId)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ count })
    } else {
      // Buscar soluções associadas ao plano
      const { data: planSolutions, error: planSolutionsError } = await supabase
        .from("plan_solutions")
        .select("solution_id")
        .eq("plan_id", planId)

      if (planSolutionsError) {
        return NextResponse.json({ error: planSolutionsError.message }, { status: 500 })
      }

      // Se não houver soluções associadas ao plano, retornar array vazio
      if (planSolutions.length === 0) {
        return NextResponse.json([])
      }

      // Extrair os IDs das soluções
      const solutionIds = planSolutions.map((ps) => ps.solution_id)

      // Buscar detalhes das soluções
      const { data: solutions, error: solutionsError } = await supabase
        .from("solutions")
        .select("*")
        .in("id", solutionIds)

      if (solutionsError) {
        return NextResponse.json({ error: solutionsError.message }, { status: 500 })
      }

      return NextResponse.json(solutions)
    }
  } catch (error) {
    console.error("Erro ao buscar soluções do plano:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// POST /api/plans/[id]/solutions - Adicionar uma solução a um plano
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAdminApiUser()
  if (authError) return authError

  try {
    const planId = Number.parseInt(params.id, 10)
    if (isNaN(planId)) {
      return NextResponse.json({ error: "ID do plano inválido" }, { status: 400 })
    }

    const body = await request.json()
    const { solution_id, custom_price, custom_limits } = body

    if (!solution_id) {
      return NextResponse.json({ error: "ID da solução é obrigatório" }, { status: 400 })
    }

    const result = await PlansService.addSolutionToPlan(planId, solution_id, custom_price, custom_limits)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erro ao adicionar solução ao plano:", error)
    return NextResponse.json({ error: "Erro ao adicionar solução ao plano" }, { status: 500 })
  }
}
