import { createServiceRoleClient } from "@/lib/supabase/service-role"
import type { Json } from "@/lib/supabase/types"

export type Solution = {
  id: number
  slug: string | null
  name: string
  description: string | null
  category: string | null
  icon: string | null
  color: string | null
  is_active: boolean | null
  is_recommended: boolean | null
  is_premium: boolean | null
  premium_plan: string | null
  activations: number | null
  is_available: boolean | null
  created_at: string | null
  updated_at: string | null
  custom_price?: number | null
  custom_limits?: Json | null
}

export class SolutionsService {
  // Buscar todas as soluções
  static async getAllSolutions(): Promise<Solution[]> {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase.from("solutions").select("*").order("name")

    if (error) {
      console.error("Erro ao buscar soluções:", error)
      throw new Error("Não foi possível buscar as soluções")
    }

    return data || []
  }

  // Buscar soluções ativas
  static async getActiveSolutions(): Promise<Solution[]> {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase.from("solutions").select("*").eq("is_active", true).order("name")

    if (error) {
      console.error("Erro ao buscar soluções ativas:", error)
      throw new Error("Não foi possível buscar as soluções ativas")
    }

    return data || []
  }

  // Buscar uma solução por ID
  static async getSolutionById(id: number): Promise<Solution | null> {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase.from("solutions").select("*").eq("id", id).single()

    if (error) {
      console.error(`Erro ao buscar solução com ID ${id}:`, error)
      return null
    }

    return data
  }

  // Buscar soluções ativas para um plano específico
  static async getActiveSolutionsForPlan(planId: number): Promise<Solution[]> {
    const supabase = createServiceRoleClient()

    // Buscar as associações entre o plano e as soluções
    const { data: planSolutions, error: planError } = await supabase
      .from("plan_solutions")
      .select("solution_id, custom_price, custom_limits")
      .eq("plan_id", planId)

    if (planError) {
      console.error(`Erro ao buscar associações do plano ${planId}:`, planError)
      throw new Error("Não foi possível buscar as associações do plano")
    }

    if (!planSolutions || planSolutions.length === 0) {
      return []
    }

    // Extrair os IDs das soluções
    const solutionIds = planSolutions.map((ps) => ps.solution_id).filter((id): id is number => id !== null)

    // Buscar as soluções correspondentes
    const { data: solutions, error: solutionsError } = await supabase
      .from("solutions")
      .select("*")
      .in("id", solutionIds)
      .eq("is_active", true)
      .order("name")

    if (solutionsError) {
      console.error(`Erro ao buscar soluções do plano ${planId}:`, solutionsError)
      throw new Error("Não foi possível buscar as soluções do plano")
    }

    // Combinar as informações das soluções com as informações personalizadas do plano
    const enrichedSolutions = solutions.map((solution) => {
      const planSolution = planSolutions.find((ps) => ps.solution_id === solution.id)
      return {
        ...solution,
        custom_price: planSolution?.custom_price || null,
        custom_limits: planSolution?.custom_limits || null,
      }
    })

    return enrichedSolutions
  }

  // Verificar se uma solução está disponível para um usuário
  static async checkSolutionAvailabilityForUser(
    userId: string,
    solutionId: number,
  ): Promise<{
    available: boolean
    reason?: string
    planId?: number
    customPrice?: number | null
    customLimits?: Json | null
  }> {
    try {
      const supabase = createServiceRoleClient()

      // Verificar se a solução existe e está ativa
      const { data: solution, error: solutionError } = await supabase
        .from("solutions")
        .select("is_active")
        .eq("id", solutionId)
        .single()

      if (solutionError || !solution) {
        return { available: false, reason: "Solução não encontrada" }
      }

      if (!solution.is_active) {
        return { available: false, reason: "Solução inativa" }
      }

      // Buscar o plano do usuário
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("plan_id")
        .eq("id", userId)
        .single()

      if (userError || !userData || !userData.plan_id) {
        return { available: false, reason: "Usuário sem plano" }
      }

      // Verificar se a solução está associada ao plano do usuário
      const { data: planSolution, error: planSolutionError } = await supabase
        .from("plan_solutions")
        .select("*")
        .eq("plan_id", userData.plan_id)
        .eq("solution_id", solutionId)
        .maybeSingle()

      if (planSolutionError) {
        console.error("Erro ao verificar associação:", planSolutionError)
        return { available: false, reason: "Erro ao verificar disponibilidade" }
      }

      if (!planSolution) {
        return { available: false, reason: "Solução não disponível no seu plano", planId: userData.plan_id }
      }

      return {
        available: true,
        planId: userData.plan_id,
        customPrice: planSolution.custom_price,
        customLimits: planSolution.custom_limits,
      }
    } catch (error) {
      console.error("Erro ao verificar disponibilidade:", error)
      return { available: false, reason: "Erro interno ao verificar disponibilidade" }
    }
  }

  // Ativar ou desativar uma solução
  static async toggleSolutionStatus(id: number, isActive: boolean): Promise<Solution | null> {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from("solutions")
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error(`Erro ao ${isActive ? "ativar" : "desativar"} solução com ID ${id}:`, error)
      throw new Error(`Não foi possível ${isActive ? "ativar" : "desativar"} a solução`)
    }

    return data
  }
}
