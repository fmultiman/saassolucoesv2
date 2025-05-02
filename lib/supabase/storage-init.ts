import { createServiceRoleClient } from "./service-role"

let storageInitialized = false

/**
 * Inicializa o storage do Supabase automaticamente
 * Esta função configura o bucket e as políticas de RLS necessárias
 */
export async function initializeStorage() {
  // Evitar inicialização múltipla
  if (storageInitialized) return { success: true, message: "Storage já inicializado" }

  try {
    console.log("Inicializando storage do Supabase...")
    const supabase = createServiceRoleClient()

    // 1. Verificar se o bucket já existe
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.error("Erro ao listar buckets:", bucketsError)
      throw bucketsError
    }

    // Verificar se o bucket user-content já existe
    const bucketExists = buckets.some((bucket) => bucket.name === "user-content")

    // 2. Criar o bucket se não existir
    if (!bucketExists) {
      console.log("Criando bucket user-content...")
      const { error: createError } = await supabase.storage.createBucket("user-content", {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      })

      if (createError) {
        console.error("Erro ao criar bucket:", createError)
        throw createError
      }
      console.log("Bucket user-content criado com sucesso")
    }

    // 3. Configurar políticas de RLS para o bucket
    // Política para permitir leitura pública
    const { error: readPolicyError } = await supabase.rpc("execute_sql", {
      sql_query: `
        BEGIN;
        -- Remover políticas existentes para evitar conflitos
        DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
        
        -- Criar política de leitura pública
        CREATE POLICY "Allow public read access" 
        ON storage.objects 
        FOR SELECT 
        USING (bucket_id = 'user-content');
        
        COMMIT;
      `,
    })

    if (readPolicyError) {
      console.error("Erro ao configurar política de leitura:", readPolicyError)
    }

    // Política para permitir upload para todos os usuários autenticados
    const { error: uploadPolicyError } = await supabase.rpc("execute_sql", {
      sql_query: `
        BEGIN;
        -- Remover políticas existentes para evitar conflitos
        DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
        
        -- Criar política de upload para usuários autenticados
        CREATE POLICY "Allow authenticated uploads" 
        ON storage.objects 
        FOR INSERT 
        TO authenticated 
        WITH CHECK (bucket_id = 'user-content');
        
        COMMIT;
      `,
    })

    if (uploadPolicyError) {
      console.error("Erro ao configurar política de upload:", uploadPolicyError)
    }

    // Política para permitir atualização/exclusão para todos os usuários autenticados
    const { error: updatePolicyError } = await supabase.rpc("execute_sql", {
      sql_query: `
        BEGIN;
        -- Remover políticas existentes para evitar conflitos
        DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
        DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
        
        -- Criar política de atualização para usuários autenticados
        CREATE POLICY "Allow authenticated updates" 
        ON storage.objects 
        FOR UPDATE 
        TO authenticated
        USING (bucket_id = 'user-content');
        
        -- Criar política de exclusão para usuários autenticados
        CREATE POLICY "Allow authenticated deletes" 
        ON storage.objects 
        FOR DELETE 
        TO authenticated
        USING (bucket_id = 'user-content');
        
        COMMIT;
      `,
    })

    if (updatePolicyError) {
      console.error("Erro ao configurar política de atualização/exclusão:", updatePolicyError)
    }

    // 4. Criar pasta avatars se não existir
    const { error: folderError } = await supabase.storage
      .from("user-content")
      .upload("avatars/.keep", new Blob([""], { type: "text/plain" }), {
        upsert: true,
      })

    if (folderError && folderError.message !== "The resource already exists") {
      console.error("Erro ao criar pasta avatars:", folderError)
    }

    storageInitialized = true
    console.log("Storage inicializado com sucesso")
    return { success: true, message: "Storage inicializado com sucesso" }
  } catch (error: any) {
    console.error("Erro ao inicializar storage:", error)
    return { success: false, error: error.message }
  }
}
