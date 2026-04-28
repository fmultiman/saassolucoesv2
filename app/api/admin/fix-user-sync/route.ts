import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/admin"
import { requireAdminMaintenanceMode } from "@/lib/admin-maintenance"
import { requireAdminApiUser } from "@/lib/api-auth"
import fs from "fs"
import path from "path"

export async function POST() {
  const maintenanceModeError = requireAdminMaintenanceMode()
  if (maintenanceModeError) return maintenanceModeError
  const authError = await requireAdminApiUser()
  if (authError) return authError

  try {
    const supabase = createClient()

    // Ler o arquivo de migração
    const migrationPath = path.join(process.cwd(), "migrations", "012_fix_user_sync.sql")
    let sql = ""

    try {
      sql = fs.readFileSync(migrationPath, "utf8")
    } catch (error) {
      console.error("Erro ao ler arquivo de migração:", error)
      return NextResponse.json(
        {
          success: false,
          message: `Erro ao ler arquivo de migração: ${error.message}`,
        },
        { status: 500 },
      )
    }

    // Executar o SQL usando a API REST direta
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/execute_sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ""}`,
      },
      body: JSON.stringify({ sql }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Erro ao executar SQL via API:", errorText)

      return NextResponse.json(
        {
          success: false,
          message: `Erro ao executar SQL via API: ${errorText}`,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Sincronização de usuários corrigida com sucesso",
    })
  } catch (error: any) {
    console.error("Erro ao corrigir sincronização de usuários:", error)
    return NextResponse.json(
      {
        success: false,
        message: `Erro interno do servidor: ${error.message || "Erro desconhecido"}`,
      },
      { status: 500 },
    )
  }
}
