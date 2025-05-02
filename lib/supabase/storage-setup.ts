import { createServiceRoleClient } from "./service-role"

/**
 * Verifica e configura o bucket de armazenamento para avatares e outros conteúdos de usuário
 */
export async function setupUserContentBucket() {
  try {
    const supabase = createServiceRoleClient()

    // Verificar se o bucket existe
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.error("Erro ao listar buckets:", bucketsError)
      throw bucketsError
    }

    const bucketExists = buckets.some((bucket) => bucket.name === "user-content")

    // Se o bucket não existir, criar
    if (!bucketExists) {
      console.log("Criando bucket 'user-content'...")
      const { error: createError } = await supabase.storage.createBucket("user-content", {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      })

      if (createError) {
        console.error("Erro ao criar bucket:", createError)
        throw createError
      }

      console.log("Bucket 'user-content' criado com sucesso")
    } else {
      console.log("Bucket 'user-content' já existe")

      // Atualizar configurações do bucket para garantir acesso público
      const { error: updateError } = await supabase.storage.updateBucket("user-content", {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      })

      if (updateError) {
        console.error("Erro ao atualizar bucket:", updateError)
        throw updateError
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Erro ao configurar bucket de armazenamento:", error)
    return { success: false, error }
  }
}
