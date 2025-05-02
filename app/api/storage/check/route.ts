import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export async function GET() {
  try {
    const supabase = createServiceRoleClient()

    // Verificar se o bucket existe
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      return NextResponse.json(
        {
          success: false,
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
          success: false,
          error: "Bucket 'user-content' não encontrado",
          buckets: buckets.map((b) => b.name),
        },
        { status: 404 },
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
      return NextResponse.json(
        {
          success: false,
          error: policiesError.message,
          details: "Erro ao verificar políticas RLS",
        },
        { status: 500 },
      )
    }

    // Testar upload de um arquivo pequeno
    const testFile = new Blob(["test"], { type: "text/plain" })
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("user-content")
      .upload("test-" + Date.now() + ".txt", testFile, {
        upsert: true,
      })

    if (uploadError) {
      return NextResponse.json(
        {
          success: false,
          error: uploadError.message,
          details: "Erro ao testar upload",
          errorObject: uploadError,
        },
        { status: 500 },
      )
    }

    // Se chegou até aqui, o storage está funcionando
    return NextResponse.json({
      success: true,
      bucket: userContentBucket,
      policies,
      testUpload: uploadData,
    })
  } catch (error: any) {
    console.error("Erro ao verificar status do storage:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
