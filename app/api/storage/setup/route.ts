import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export async function POST() {
  try {
    const supabase = createServiceRoleClient()

    console.log("Iniciando configuração do storage...")

    // Verificar se o bucket já existe
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.error("Erro ao listar buckets:", bucketsError)
      return NextResponse.json({ error: bucketsError.message }, { status: 500 })
    }

    const bucketExists = buckets.some((bucket) => bucket.name === "user-content")

    // Criar bucket se não existir
    if (!bucketExists) {
      console.log("Criando bucket 'user-content'...")
      const { error: createError } = await supabase.storage.createBucket("user-content", {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      })

      if (createError) {
        console.error("Erro ao criar bucket:", createError)
        return NextResponse.json({ error: createError.message }, { status: 500 })
      }
    } else {
      console.log("Bucket 'user-content' já existe.")

      // Atualizar configuração do bucket para garantir que seja público
      const { error: updateError } = await supabase.rpc("execute_sql", {
        sql_query: `
          UPDATE storage.buckets 
          SET public = true, file_size_limit = 5242880 
          WHERE name = 'user-content';
        `,
      })

      if (updateError) {
        console.error("Erro ao atualizar configuração do bucket:", updateError)
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }
    }

    // Configurar políticas RLS
    console.log("Configurando políticas RLS...")

    // Remover políticas existentes
    const { error: dropError } = await supabase.rpc("execute_sql", {
      sql_query: `
        DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
        DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
        DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
        DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
      `,
    })

    if (dropError) {
      console.error("Erro ao remover políticas existentes:", dropError)
      return NextResponse.json({ error: dropError.message }, { status: 500 })
    }

    // Criar política de leitura pública
    const { error: readPolicyError } = await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE POLICY "Allow public read access" 
        ON storage.objects 
        FOR SELECT 
        USING (bucket_id = 'user-content');
      `,
    })

    if (readPolicyError) {
      console.error("Erro ao criar política de leitura:", readPolicyError)
      return NextResponse.json({ error: readPolicyError.message }, { status: 500 })
    }

    // Criar política de upload
    const { error: uploadPolicyError } = await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE POLICY "Allow authenticated uploads" 
        ON storage.objects 
        FOR INSERT 
        TO authenticated 
        WITH CHECK (bucket_id = 'user-content');
      `,
    })

    if (uploadPolicyError) {
      console.error("Erro ao criar política de upload:", uploadPolicyError)
      return NextResponse.json({ error: uploadPolicyError.message }, { status: 500 })
    }

    // Criar política de atualização
    const { error: updatePolicyError } = await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE POLICY "Allow authenticated updates" 
        ON storage.objects 
        FOR UPDATE 
        TO authenticated
        USING (bucket_id = 'user-content');
      `,
    })

    if (updatePolicyError) {
      console.error("Erro ao criar política de atualização:", updatePolicyError)
      return NextResponse.json({ error: updatePolicyError.message }, { status: 500 })
    }

    // Criar política de exclusão
    const { error: deletePolicyError } = await supabase.rpc("execute_sql", {
      sql_query: `
        CREATE POLICY "Allow authenticated deletes" 
        ON storage.objects 
        FOR DELETE 
        TO authenticated
        USING (bucket_id = 'user-content');
      `,
    })

    if (deletePolicyError) {
      console.error("Erro ao criar política de exclusão:", deletePolicyError)
      return NextResponse.json({ error: deletePolicyError.message }, { status: 500 })
    }

    // Garantir que o RLS está habilitado
    const { error: rlsError } = await supabase.rpc("execute_sql", {
      sql_query: `
        ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
      `,
    })

    if (rlsError) {
      console.error("Erro ao habilitar RLS:", rlsError)
      return NextResponse.json({ error: rlsError.message }, { status: 500 })
    }

    // Testar upload
    console.log("Testando upload...")
    const testFile = new Blob(["test"], { type: "text/plain" })
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("user-content")
      .upload("test-setup-" + Date.now() + ".txt", testFile, {
        upsert: true,
      })

    if (uploadError) {
      console.error("Erro ao testar upload:", uploadError)
      return NextResponse.json({
        success: false,
        message: "Configuração concluída, mas o teste de upload falhou",
        error: uploadError.message,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Storage configurado com sucesso",
      bucketExists,
      testUpload: uploadData,
    })
  } catch (error: any) {
    console.error("Erro ao configurar storage:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
