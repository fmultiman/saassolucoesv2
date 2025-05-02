import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export async function POST(request: Request) {
  try {
    const { error, bucket } = await request.json()
    const supabase = createServiceRoleClient()

    // Verificar se o bucket existe
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      return NextResponse.json({ error: bucketsError.message }, { status: 500 })
    }

    const bucketExists = buckets.some((b) => b.name === bucket)

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

    // Verificar configuração do bucket
    const { data: bucketConfig, error: bucketConfigError } = await supabase.rpc("execute_sql", {
      sql_query: `
        SELECT * FROM storage.buckets WHERE name = '${bucket}';
      `,
    })

    return NextResponse.json({
      originalError: error,
      bucketExists,
      buckets: buckets.map((b) => b.name),
      policies,
      policiesError: policiesError?.message,
      bucketConfig,
      bucketConfigError: bucketConfigError?.message,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
