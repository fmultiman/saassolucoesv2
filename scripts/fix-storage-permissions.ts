import { createServiceRoleClient } from "../lib/supabase/service-role"

async function fixStoragePermissions() {
  try {
    console.log("Iniciando verificação de permissões de armazenamento...")
    const supabase = createServiceRoleClient()

    // Verificar se o bucket existe
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.error("Erro ao listar buckets:", bucketsError)
      return
    }

    const userContentBucket = buckets.find((bucket) => bucket.name === "user-content")

    if (!userContentBucket) {
      console.log("Bucket 'user-content' não encontrado. Criando...")
      const { error: createError } = await supabase.storage.createBucket("user-content", {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      })

      if (createError) {
        console.error("Erro ao criar bucket:", createError)
        return
      }

      console.log("Bucket 'user-content' criado com sucesso")
    } else {
      console.log("Bucket 'user-content' encontrado. Atualizando configurações...")

      // Atualizar configurações do bucket para garantir acesso público
      const { error: updateError } = await supabase.storage.updateBucket("user-content", {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      })

      if (updateError) {
        console.error("Erro ao atualizar bucket:", updateError)
        return
      }

      console.log("Configurações do bucket atualizadas com sucesso")
    }

    // Configurar políticas de acesso público para o bucket
    console.log("Configurando políticas de acesso...")

    // Política para permitir leitura pública
    const { error: policyError } = await supabase.rpc("create_storage_policy", {
      bucket_name: "user-content",
      policy_name: "Public Read Access",
      definition: "true", // Permitir acesso público para leitura
      operation: "SELECT",
    })

    if (policyError) {
      console.error("Erro ao criar política de leitura:", policyError)
    } else {
      console.log("Política de leitura pública configurada com sucesso")
    }

    // Política para permitir upload por usuários autenticados
    const { error: uploadPolicyError } = await supabase.rpc("create_storage_policy", {
      bucket_name: "user-content",
      policy_name: "Authenticated Upload",
      definition: "auth.uid() IS NOT NULL", // Apenas usuários autenticados
      operation: "INSERT",
    })

    if (uploadPolicyError) {
      console.error("Erro ao criar política de upload:", uploadPolicyError)
    } else {
      console.log("Política de upload configurada com sucesso")
    }

    // Política para permitir que usuários excluam seus próprios arquivos
    const { error: deletePolicyError } = await supabase.rpc("create_storage_policy", {
      bucket_name: "user-content",
      policy_name: "Owner Delete",
      definition: "auth.uid() IS NOT NULL", // Apenas usuários autenticados
      operation: "DELETE",
    })

    if (deletePolicyError) {
      console.error("Erro ao criar política de exclusão:", deletePolicyError)
    } else {
      console.log("Política de exclusão configurada com sucesso")
    }

    console.log("Verificação de permissões concluída")
  } catch (error) {
    console.error("Erro ao configurar permissões de armazenamento:", error)
  }
}

// Executar o script
fixStoragePermissions()
