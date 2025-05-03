import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const solutionId = params.id

    if (!userId) {
      return NextResponse.json({ available: false, reason: "Usuário não autenticado" }, { status: 401 })
    }

    const supabase = createServerClient()

    // Buscar o plano do usuário
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("plan_id")
      .eq("id", userId)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ available: false, reason: "Usuário não encontrado" }, { status: 404 })
    }

    const userPlanId = userData.plan_id

    // Se o usuário não tem plano, não tem acesso
    if (!userPlanId) {
      // Buscar o plano mais barato que inclui esta solução
      const { data: cheapestPlan } = await supabase
        .from("plans")
        .select("id, name, price")
        .in("id", supabase.from("plan_solutions").select("plan_id").eq("solution_id", solutionId))
        .order("price", { ascending: true })
        .limit(1)
        .single()

      return NextResponse.json({
        available: false,
        reason: "Você precisa ter um plano para acessar esta solução",
        upgradePlan: cheapestPlan,
      })
    }

    // Verificar se a solução está disponível no plano do usuário
    const { data: planSolution, error: planSolutionError } = await supabase
      .from("plan_solutions")
      .select("*")
      .eq("plan_id", userPlanId)
      .eq("solution_id", solutionId)
      .single()

    if (planSolutionError || !planSolution) {
      // Buscar o plano mais barato que inclui esta solução
      const { data: cheapestPlan } = await supabase
        .from("plans")
        .select("id, name, price")
        .in("id", supabase.from("plan_solutions").select("plan_id").eq("solution_id", solutionId))
        .order("price", { ascending: true })
        .limit(1)
        .single()

      return NextResponse.json({
        available: false,
        reason: "Esta solução não está disponível no seu plano atual",
        upgradePlan: cheapestPlan,
      })
    }

    // Se chegou até aqui, a solução está disponível
    return NextResponse.json({ available: true })
  } catch (error) {
    console.error("Erro ao verificar disponibilidade:", error)
    return NextResponse.json({ available: false, reason: "Erro interno do servidor" }, { status: 500 })
  }
}
