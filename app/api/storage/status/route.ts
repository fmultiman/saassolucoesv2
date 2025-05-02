import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export const dynamic = "force-dynamic" // Garantir que a rota seja sempre dinâmica

export async function GET() {
  try {
    const supabase = createServiceRoleClient()

    // Verificar se o bucket existe
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.error("Erro ao listar buckets:", bucketsError)
      return NextResponse.json(
        {
          configured: false,
          error: bucketsError.message,
          details: "Erro ao listar buckets",
        },
        { status: 500 },
      )
    }

    const userContentBucket = buckets.find((bucket) => bucket.name === "user-content")

    if (!userContentBucket) {
      return NextResponse.json(
        {
          configured: false,
          error: "Bucket 'user-content' não encontrado",
          buckets: buckets.map((b) => b.name),
        },
        { status: 200 }, // Retornar 200 mesmo quando não configurado
      )
    }

    // Verificar políticas RLS
    const { data: policies, error: policiesError } = await supabase.rpc("execute_sql", {
      sql_query: `
        SELECT 
          policyname, 
          permissive, 
          roles, 
          cmd, 
          qual, 
          with_check
        FROM 
          pg_policies 
        WHERE 
          tablename = 'objects' 
          AND schemaname = 'storage';
      `,
    })

    if (policiesError) {
      console.error("Erro ao verificar políticas RLS:", policiesError)
      return NextResponse.json(
        {
          configured: false,
          error: policiesError.message,
          details: "Erro ao verificar políticas RLS",
        },
        { status: 200 }, // Retornar 200 mesmo quando há erro
      )
    }

    // Testar upload de um arquivo pequeno para verificar permissões
    const testFile = new Blob(["test"], { type: "text/plain" })
    const testPath = "status-check/test-" + Date.now() + ".txt"

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("user-content")
      .upload(testPath, testFile, {
        upsert: true,
      })

    // Se houver erro no upload, ainda consideramos configurado se o bucket existe
    if (uploadError) {
      console.warn("Aviso: Bucket existe mas teste de upload falhou:", uploadError)
      return NextResponse.json({
        configured: true, // Consideramos configurado mesmo com erro no upload
        bucket: userContentBucket,
        policies,
        uploadTest: {
          success: false,
          error: uploadError.message,
        },
      })
    }

    // Limpar o arquivo de teste após o upload bem-sucedido
    if (uploadData) {
      await supabase.storage
        .from("user-content")
        .remove([testPath])
        .catch((err) => {
          console.warn("Não foi possível remover arquivo de teste:", err)
        })
    }

    // Se chegou até aqui, o storage está funcionando perfeitamente
    return NextResponse.json({
      configured: true,
      bucket: userContentBucket,
      policies,
      uploadTest: {
        success: true,
      },
    })
  } catch (error: any) {
    console.error("Erro ao verificar status do storage:", error)
    return NextResponse.json(
      {
        configured: false,
        error: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
