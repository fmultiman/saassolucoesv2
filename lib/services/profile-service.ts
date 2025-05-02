import { createServiceRoleClient } from "@/lib/supabase/service-role"
import type { ProfileUpdateData } from "@/types/user"

export async function getUserProfileById(userId: string) {
  const supabase = createServiceRoleClient()

  // Usar a view para obter dados completos do usuário e perfil
  const { data, error } = await supabase.from("user_profiles_view").select("*").eq("id", userId).single()

  if (error) {
    console.error("Erro ao buscar perfil do usuário:", error)
    return null
  }

  return data
}

export async function updateUserProfile(userId: string, profileData: ProfileUpdateData) {
  const supabase = createServiceRoleClient()

  // Verificar se o perfil existe
  const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", userId).single()

  if (!existingProfile) {
    // Se o perfil não existir, criar um novo
    const { error: insertError } = await supabase.from("profiles").insert({ id: userId, ...profileData })

    if (insertError) {
      console.error("Erro ao criar perfil:", insertError)
      return { success: false, error: insertError.message }
    }
  } else {
    // Se o perfil existir, atualizar
    const { error: updateError } = await supabase.from("profiles").update(profileData).eq("id", userId)

    if (updateError) {
      console.error("Erro ao atualizar perfil:", updateError)
      return { success: false, error: updateError.message }
    }
  }

  return { success: true }
}

export async function getAllUserProfiles(page = 1, limit = 10) {
  const supabase = createServiceRoleClient()
  const offset = (page - 1) * limit

  // Usar a view para obter dados completos dos usuários e perfis
  const { data, error, count } = await supabase
    .from("user_profiles_view")
    .select("*", { count: "exact" })
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar perfis de usuários:", error)
    return { data: [], count: 0 }
  }

  return { data: data || [], count: count || 0 }
}

export async function searchUserProfiles(query: string, page = 1, limit = 10) {
  const supabase = createServiceRoleClient()
  const offset = (page - 1) * limit

  // Busca por nome, email ou empresa
  const { data, error, count } = await supabase
    .from("user_profiles_view")
    .select("*", { count: "exact" })
    .or(`name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%`)
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar perfis de usuários:", error)
    return { data: [], count: 0 }
  }

  return { data: data || [], count: count || 0 }
}

export async function getUserProfileStats() {
  const supabase = createServiceRoleClient()

  // Estatísticas gerais de perfis
  const { data, error } = await supabase.from("user_profiles_view").select("role, verified, has_profile")

  if (error || !data) {
    console.error("Erro ao buscar estatísticas de perfis:", error)
    return {
      total: 0,
      verified: 0,
      withProfile: 0,
      byRole: {},
    }
  }

  const stats = {
    total: data.length,
    verified: data.filter((user) => user.verified).length,
    withProfile: data.filter((user) => user.has_profile).length,
    byRole: data.reduce((acc: Record<string, number>, user) => {
      const role = user.role || "unknown"
      acc[role] = (acc[role] || 0) + 1
      return acc
    }, {}),
  }

  return stats
}
// Verificar se há algum problema com o serviço de perfil
// Não fazer alterações a menos que seja necessário
