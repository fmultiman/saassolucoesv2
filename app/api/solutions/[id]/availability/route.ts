import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const solutionId = Number.parseInt(id, 10)
    if (Number.isNaN(solutionId)) {
      return NextResponse.json({ available: false, reason: "ID da solucao invalido" }, { status: 400 })
    }
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ available: false, reason: "Usuário não autenticado" }, { status: 401 })
    }

    const supabase = createServerClient(await cookies())

    // Buscar o plano do usuário
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("plan_id")
      .eq("id", userId)
      .single()

    if (userError || !userData || !userData.plan_id) {
      return NextResponse.json({ available: false, reason: "Usuário não encontrado" }, { status: 404 })
    }

    // Buscar as soluções do plano
    const { data: planSolutions, error: planSolutionsError } = await supabase
      .from("plan_solutions")
      .select("solution_id")
      .eq("plan_id", userData.plan_id)

    if (planSolutionsError) {
      return NextResponse.json({ available: false, reason: "Erro ao buscar soluções do plano" }, { status: 500 })
    }

    const isAvailable = planSolutions?.some((ps) => ps.solution_id === solutionId)

    return NextResponse.json({ available: isAvailable })
  } catch (error) {
    console.error("Erro ao verificar disponibilidade:", error)
    return NextResponse.json({ available: false, reason: "Erro interno do servidor" }, { status: 500 })
  }
}
