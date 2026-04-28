import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const solutionId = Number.parseInt(id, 10)
    if (Number.isNaN(solutionId)) {
      return NextResponse.json({ available: false, reason: "ID da solucao invalido" }, { status: 400 })
    }

    const supabase = createServerClient(await cookies())

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ available: false, reason: "Usuario nao autenticado" }, { status: 401 })
    }

    const { data: solution, error: solutionError } = await supabase
      .from("solutions")
      .select("is_active")
      .eq("id", solutionId)
      .maybeSingle()

    if (solutionError || !solution) {
      return NextResponse.json({ available: false, reason: "Solucao nao encontrada" }, { status: 404 })
    }

    if (!solution.is_active) {
      return NextResponse.json({ available: false, reason: "Solucao inativa" }, { status: 403 })
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("plan_id")
      .eq("id", user.id)
      .maybeSingle()

    if (userError || !userData?.plan_id) {
      return NextResponse.json({ available: false, reason: "Usuario sem plano ativo" }, { status: 404 })
    }

    const { data: planSolutions, error: planSolutionsError } = await supabase
      .from("plan_solutions")
      .select("solution_id")
      .eq("plan_id", userData.plan_id)

    if (planSolutionsError) {
      return NextResponse.json({ available: false, reason: "Erro ao buscar solucoes do plano" }, { status: 500 })
    }

    const isAvailable = planSolutions?.some((ps) => ps.solution_id === solutionId) ?? false

    return NextResponse.json({
      available: isAvailable,
      reason: isAvailable ? undefined : "Solucao nao disponivel no seu plano",
      planId: userData.plan_id,
      plan_id: userData.plan_id,
    })
  } catch (error) {
    console.error("Erro ao verificar disponibilidade:", error)
    return NextResponse.json({ available: false, reason: "Erro interno do servidor" }, { status: 500 })
  }
}
