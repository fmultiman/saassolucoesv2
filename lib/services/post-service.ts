import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { cacheData, getCachedData, invalidateCache } from "@/lib/redis"

const CACHE_TTL = 60 * 60 // 1 hora em segundos
const POST_CACHE_KEY_PREFIX = "blog:post:"
const POSTS_LIST_CACHE_KEY = "blog:posts:list"

export async function getPostBySlug(slug: string) {
  // Tentar obter do cache primeiro
  const cacheKey = `${POST_CACHE_KEY_PREFIX}${slug}`
  const cachedPost = await getCachedData(cacheKey)

  if (cachedPost) {
    console.log(`Post encontrado em cache: ${slug}`)
    return cachedPost
  }

  // Se não estiver em cache, buscar do Supabase
  console.log(`Buscando post do banco de dados: ${slug}`)
  const supabase = createServiceRoleClient()

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (error) {
    console.error("Erro ao buscar post:", error)
    throw error
  }

  if (post) {
    // Armazenar em cache para futuras requisições
    await cacheData(cacheKey, post, CACHE_TTL)
  }

  return post
}

export async function getAllPosts() {
  // Tentar obter do cache primeiro
  const cachedPosts = await getCachedData(POSTS_LIST_CACHE_KEY)

  if (cachedPosts) {
    console.log("Lista de posts encontrada em cache")
    return cachedPosts
  }

  // Se não estiver em cache, buscar do Supabase
  console.log("Buscando lista de posts do banco de dados")
  const supabase = createServiceRoleClient()

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar posts:", error)
    throw error
  }

  if (posts) {
    // Armazenar em cache para futuras requisições
    await cacheData(POSTS_LIST_CACHE_KEY, posts, CACHE_TTL)
  }

  return posts
}

export async function invalidatePostCache(slug: string) {
  // Invalidar cache do post específico
  await invalidateCache(`${POST_CACHE_KEY_PREFIX}${slug}`)
  // Invalidar cache da lista de posts
  await invalidateCache(POSTS_LIST_CACHE_KEY)
}
