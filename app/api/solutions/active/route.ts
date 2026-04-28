import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

// GET /api/solutions/active - Buscar soluções ativas, opcionalmente filtradas por plano
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const planId = searchParams.get("planId")
    const planIdNumber = planId ? Number.parseInt(planId, 10) : null
    const limitParam = searchParams.get("limit")
    const limit = limitParam ? Number.parseInt(limitParam, 10) : undefined

    if (planId && Number.isNaN(planIdNumber)) {
      return NextResponse.json({ error: "ID do plano invalido" }, { status: 400 })
    }

    if (limitParam && (!limit || Number.isNaN(limit) || limit < 1)) {
      return NextResponse.json({ error: "Limite invalido" }, { status: 400 })
    }

    const supabase = createServiceRoleClient()

    let query = supabase.from("solutions").select("*").eq("is_active", true).order("name")

    // Se tiver planId, buscar apenas soluções disponíveis para o plano
    if (planId) {
      // Buscar soluções associadas ao plano
      const { data: planSolutions, error: planError } = await supabase
        .from("plan_solutions")
        .select("solution_id")
        .eq("plan_id", planIdNumber!)

      if (planError) {
        return NextResponse.json({ error: planError.message }, { status: 500 })
      }

      // Extrair os IDs das soluções
      const solutionIds = planSolutions.map((ps) => ps.solution_id).filter((id): id is number => id !== null)

      // Se não houver soluções associadas ao plano, retornar array vazio
      if (solutionIds.length === 0) {
        return NextResponse.json([])
      }

      // Filtrar por soluções associadas ao plano
      query = query.in("id", solutionIds)
    }

    // Aplicar limite se especificado
    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao buscar soluções ativas:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
