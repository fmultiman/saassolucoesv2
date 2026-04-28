import { createServiceRoleClient } from "@/lib/supabase/service-role"
import type { Json } from "@/lib/supabase/types"

export type Plan = {
  id: number
  name: string
  description: string | null
  price: number | null
  code: string | null
  features: Json | null
  interval: string | null
  billing_cycle: string | null
  is_active: boolean | null
  is_featured: boolean | null
  max_solutions: number | null
  sort_order: number | null
  created_at: string | null
  updated_at: string | null
}

export type PlanSolution = {
  id: number
  plan_id: number | null
  solution_id: number | null
  custom_price: number | null
  custom_limits: Json | null
  created_at: string | null
  updated_at?: string | null
}

export class PlansService {
  // Buscar todos os planos
  static async getAllPlans(): Promise<Plan[]> {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase.from("plans").select("*").order("price")

    if (error) {
      console.error("Erro ao buscar planos:", error)
      throw new Error("Não foi possível buscar os planos")
    }

    return data || []
  }

  // Buscar planos ativos
  static async getActivePlans(): Promise<Plan[]> {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase.from("plans").select("*").eq("is_active", true).order("price")

    if (error) {
      console.error("Erro ao buscar planos ativos:", error)
      throw new Error("Não foi possível buscar os planos ativos")
    }

    return data || []
  }

  // Buscar um plano por ID
  static async getPlanById(id: number): Promise<Plan | null> {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase.from("plans").select("*").eq("id", id).single()

    if (error) {
      console.error(`Erro ao buscar plano com ID ${id}:`, error)
      return null
    }

    return data
  }

  // Buscar soluções associadas a um plano
  static async getPlanSolutions(planId: number): Promise<any[]> {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from("plan_solutions")
      .select(`
        id,
        plan_id,
        solution_id,
        custom_price,
        custom_limits,
        solutions (
          id,
          name,
          description,
          category,
          is_active
        )
      `)
      .eq("plan_id", planId)

    if (error) {
      console.error(`Erro ao buscar soluções do plano ${planId}:`, error)
      throw new Error("Não foi possível buscar as soluções do plano")
    }

    // Transformar os dados para um formato mais amigável
    return (
      data?.flatMap((item) => item.solutions ? [{
        id: item.solutions.id,
        name: item.solutions.name,
        description: item.solutions.description,
        category: item.solutions.category,
        is_active: item.solutions.is_active,
        plan_solution_id: item.id,
        custom_price: item.custom_price,
        custom_limits: item.custom_limits,
      }] : []) || []
    )
  }

  // Buscar planos associados a uma solução
  static async getSolutionPlans(solutionId: number): Promise<any[]> {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from("plan_solutions")
      .select(`
        id,
        plan_id,
        solution_id,
        custom_price,
        custom_limits,
        plans (
          id,
          name,
          description,
          price,
          is_active
        )
      `)
      .eq("solution_id", solutionId)

    if (error) {
      console.error(`Erro ao buscar planos da solução ${solutionId}:`, error)
      throw new Error("Não foi possível buscar os planos da solução")
    }

    // Transformar os dados para um formato mais amigável
    return (
      data?.flatMap((item) => item.plans ? [{
        id: item.plans.id,
        name: item.plans.name,
        description: item.plans.description,
        price: item.plans.price,
        is_active: item.plans.is_active,
        plan_solution_id: item.id,
        custom_price: item.custom_price,
        custom_limits: item.custom_limits,
      }] : []) || []
    )
  }

  // Associar uma solução a um plano
  static async addSolutionToPlan(
    planId: number,
    solutionId: number,
    customPrice?: number,
    customLimits?: Record<string, any>,
  ): Promise<PlanSolution> {
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
      throw new Error("Não foi possível verificar se a associação já existe")
    }

    if (existingData) {
      console.log("Associação já existe, atualizando...")
      const { data: updatedData, error: updateError } = await supabase
        .from("plan_solutions")
        .update({
          custom_price: customPrice,
          custom_limits: customLimits,
        })
        .eq("id", existingData.id)
        .select()
        .single()

      if (updateError) {
        console.error("Erro ao atualizar associação:", updateError)
        throw new Error("Não foi possível atualizar a associação")
      }

      return updatedData
    }

    // Criar nova associação
    const { data, error } = await supabase
      .from("plan_solutions")
      .insert({
        plan_id: planId,
        solution_id: solutionId,
        custom_price: customPrice,
        custom_limits: customLimits,
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao associar solução ao plano:", error)
      throw new Error("Não foi possível associar a solução ao plano")
    }

    return data
  }

  // Remover uma solução de um plano
  static async removeSolutionFromPlan(planSolutionId: number): Promise<void> {
    const supabase = createServiceRoleClient()
    const { error } = await supabase.from("plan_solutions").delete().eq("id", planSolutionId)

    if (error) {
      console.error(`Erro ao remover associação com ID ${planSolutionId}:`, error)
      throw new Error("Não foi possível remover a associação")
    }
  }

  // Verificar se um usuário tem acesso a uma solução específica
  static async checkUserAccessToSolution(userId: string, solutionId: number): Promise<boolean> {
    try {
      const supabase = createServiceRoleClient()

      // Buscar o plano do usuário
      const { data: userData, error: userError } = await supabase.from("users").select("plan").eq("id", userId).single()

      if (userError || !userData || !userData.plan) {
        return false
      }

      // Mapear o plano do usuário para o ID do plano no banco de dados
      let planId: number | null = null

      // Buscar o ID do plano com base no código do plano
      const { data: planData, error: planError } = await supabase
        .from("plans")
        .select("id")
        .eq("code", userData.plan)
        .single()

      if (planError || !planData) {
        console.error("Erro ao buscar ID do plano:", planError)
        return false
      }

      planId = planData.id

      // Verificar se a solução está associada ao plano do usuário
      const { data, error } = await supabase
        .from("plan_solutions")
        .select("*")
        .eq("plan_id", planId)
        .eq("solution_id", solutionId)
        .single()

      if (error || !data) {
        return false
      }

      return true
    } catch (error) {
      console.error("Erro ao verificar acesso do usuário à solução:", error)
      return false
    }
  }

  // Criar um novo plano
  static async createPlan(planData: Partial<Plan>): Promise<Plan> {
    const supabase = createServiceRoleClient()

    // Garantir que o código do plano seja consistente com o nome
    if (planData.name && !planData.code) {
      planData.code = planData.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "-")
    }

    if (!planData.name) {
      throw new Error("Nome do plano é obrigatório")
    }

    const { data, error } = await supabase
      .from("plans")
      .insert({ ...planData, name: planData.name })
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar plano:", error)
      throw new Error("Não foi possível criar o plano")
    }

    return data
  }

  // Atualizar um plano existente
  static async updatePlan(id: number, planData: Partial<Plan>): Promise<Plan> {
    const supabase = createServiceRoleClient()

    // Garantir que o código do plano seja consistente com o nome se o nome for alterado
    if (planData.name && !planData.code) {
      planData.code = planData.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "-")
    }

    const { data, error } = await supabase
      .from("plans")
      .update({
        ...planData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Erro ao atualizar plano:", error)
      throw new Error("Não foi possível atualizar o plano")
    }

    return data
  }

  // Excluir um plano
  static async deletePlan(id: number): Promise<void> {
    const supabase = createServiceRoleClient()

    // Verificar se há usuários usando este plano
    const { data: users, error: usersError } = await supabase.from("users").select("id").eq("plan_id", id).limit(1)

    if (usersError) {
      console.error("Erro ao verificar usuários do plano:", usersError)
      throw new Error("Não foi possível verificar se há usuários usando este plano")
    }

    if (users && users.length > 0) {
      throw new Error("Não é possível excluir um plano que está sendo usado por usuários")
    }

    // Excluir as associações com soluções primeiro
    const { error: planSolutionsError } = await supabase.from("plan_solutions").delete().eq("plan_id", id)

    if (planSolutionsError) {
      console.error("Erro ao excluir associações do plano:", planSolutionsError)
      throw new Error("Não foi possível excluir as associações do plano")
    }

    // Excluir o plano
    const { error } = await supabase.from("plans").delete().eq("id", id)

    if (error) {
      console.error("Erro ao excluir plano:", error)
      throw new Error("Não foi possível excluir o plano")
    }
  }
}
