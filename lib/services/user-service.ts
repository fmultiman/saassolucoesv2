import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { cacheData, getCachedData, invalidateCache } from "@/lib/redis"

const CACHE_TTL = 60 * 15 // 15 minutos em segundos
const USER_CACHE_KEY_PREFIX = "user:"
const USERS_LIST_CACHE_KEY = "users:list"

export async function getUserById(userId: string) {
  // Tentar obter do cache primeiro
  const cacheKey = `${USER_CACHE_KEY_PREFIX}${userId}`
  const cachedUser = await getCachedData(cacheKey)

  if (cachedUser) {
    console.log(`Usuário encontrado em cache: ${userId}`)
    return cachedUser
  }

  // Se não estiver em cache, buscar do Supabase
  console.log(`Buscando usuário do banco de dados: ${userId}`)
  const supabase = createServiceRoleClient()

  const { data: user, error } = await supabase.from("users").select("*").eq("id", userId).single()

  if (error) {
    console.error("Erro ao buscar usuário:", error)
    throw error
  }

  if (user) {
    // Armazenar em cache para futuras requisições
    await cacheData(cacheKey, user, CACHE_TTL)
  }

  return user
}

export async function getAllUsers() {
  // Tentar obter do cache primeiro
  const cachedUsers = await getCachedData(USERS_LIST_CACHE_KEY)

  if (cachedUsers) {
    console.log("Lista de usuários encontrada em cache")
    return cachedUsers
  }

  // Se não estiver em cache, buscar do Supabase
  console.log("Buscando lista de usuários do banco de dados")
  const supabase = createServiceRoleClient()

  const { data: users, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar usuários:", error)
    throw error
  }

  if (users) {
    // Armazenar em cache para futuras requisições
    await cacheData(USERS_LIST_CACHE_KEY, users, CACHE_TTL)
  }

  return users
}

export async function updateUser(userId: string, userData: any) {
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase.from("users").update(userData).eq("id", userId).select().single()

  if (error) {
    console.error("Erro ao atualizar usuário:", error)
    throw error
  }

  // Invalidar cache do usuário
  await invalidateUserCache(userId)

  return data
}

export async function invalidateUserCache(userId: string) {
  // Invalidar cache do usuário específico
  await invalidateCache(`${USER_CACHE_KEY_PREFIX}${userId}`)
  // Invalidar cache da lista de usuários
  await invalidateCache(USERS_LIST_CACHE_KEY)
}
