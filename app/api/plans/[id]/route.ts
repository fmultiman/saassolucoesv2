import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { requireAdminApiUser } from "@/lib/api-auth"
import { NextResponse } from "next/server"

// GET - Obter um plano específico
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const planId = Number.parseInt(id, 10)
    if (Number.isNaN(planId)) {
      return NextResponse.json({ error: "ID do plano invalido" }, { status: 400 })
    }
    const supabase = createServiceRoleClient()

    const { data, error } = await supabase.from("plans").select("*").eq("id", planId).single()

    if (error) {
      console.error("Erro ao buscar plano:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Plano não encontrado" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Exceção ao buscar plano:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// PUT - Atualizar um plano específico
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdminApiUser()
  if (authError) return authError

  try {
    const { id } = await params
    const planId = Number.parseInt(id, 10)
    if (Number.isNaN(planId)) {
      return NextResponse.json({ error: "ID do plano invalido" }, { status: 400 })
    }
    const body = await request.json()
    const {
      name,
      description,
      price,
      code,
      features,
      billing_cycle,
      interval,
      is_active,
      is_featured,
      max_solutions,
      sort_order,
    } = body

    const supabase = createServiceRoleClient()

    // Verificar se o plano existe
    const { data: existingData, error: existingError } = await supabase.from("plans").select("*").eq("id", planId).single()

    if (existingError) {
      console.error("Erro ao verificar plano existente:", existingError)
      return NextResponse.json({ error: existingError.message }, { status: 500 })
    }

    if (!existingData) {
      return NextResponse.json({ error: "Plano não encontrado" }, { status: 404 })
    }

    // Atualizar o plano
    const nextBillingCycle = billing_cycle !== undefined ? billing_cycle : existingData.billing_cycle
    const nextInterval = interval !== undefined ? interval : nextBillingCycle === "anual" ? "year" : "month"

    const { data, error } = await supabase
      .from("plans")
      .update({
        name: name !== undefined ? name : existingData.name,
        description: description !== undefined ? description : existingData.description,
        price: price !== undefined ? price : existingData.price,
        code: code !== undefined ? code : existingData.code,
        features: features !== undefined ? features : existingData.features,
        billing_cycle: nextBillingCycle,
        interval: nextInterval,
        is_active: is_active !== undefined ? is_active : existingData.is_active,
        is_featured: is_featured !== undefined ? is_featured : existingData.is_featured,
        max_solutions: max_solutions !== undefined ? max_solutions : existingData.max_solutions,
        sort_order: sort_order !== undefined ? sort_order : existingData.sort_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", planId)
      .select()
      .single()

    if (error) {
      console.error("Erro ao atualizar plano:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Exceção ao atualizar plano:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// DELETE - Excluir um plano específico
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdminApiUser()
  if (authError) return authError

  try {
    const { id } = await params
    const planId = Number.parseInt(id, 10)
    if (Number.isNaN(planId)) {
      return NextResponse.json({ error: "ID do plano invalido" }, { status: 400 })
    }

    const supabase = createServiceRoleClient()

    // Verificar se há usuários usando este plano antes de excluir
    const { data: users, error: usersError } = await supabase.from("users").select("id").eq("plan_id", planId).limit(1)

    if (usersError) {
      console.error("Erro ao verificar usuários do plano:", usersError)
      return NextResponse.json({ error: usersError.message }, { status: 500 })
    }

    if (users && users.length > 0) {
      return NextResponse.json(
        { error: "Não é possível excluir um plano que está sendo usado por usuários" },
        { status: 400 },
      )
    }

    // Excluir as associações com soluções primeiro
    const { error: planSolutionsError } = await supabase.from("plan_solutions").delete().eq("plan_id", planId)

    if (planSolutionsError) {
      console.error("Erro ao excluir associações do plano:", planSolutionsError)
      return NextResponse.json({ error: planSolutionsError.message }, { status: 500 })
    }

    // Excluir o plano
    const { error } = await supabase.from("plans").delete().eq("id", planId)

    if (error) {
      console.error("Erro ao excluir plano:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Exceção ao excluir plano:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
