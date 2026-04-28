import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/admin"
import { requireAdminMaintenanceMode } from "@/lib/admin-maintenance"
import fs from "fs"
import path from "path"

export async function POST() {
  const maintenanceModeError = requireAdminMaintenanceMode()
  if (maintenanceModeError) return maintenanceModeError

  try {
    const supabase = createClient()

    // Ler o arquivo de migração
    const migrationPath = path.join(process.cwd(), "migrations", "013_reset_auth_system.sql")
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

    // Executar o SQL diretamente
    const { error } = await supabase.rpc("execute_sql", { sql })

    if (error) {
      console.error("Erro ao executar SQL:", error)
      return NextResponse.json(
        {
          success: false,
          message: `Erro ao executar SQL: ${error.message}`,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Sistema de autenticação resetado e reconstruído com sucesso",
    })
  } catch (error: any) {
    console.error("Erro ao resetar sistema de autenticação:", error)
    return NextResponse.json(
      {
        success: false,
        message: `Erro interno do servidor: ${error.message || "Erro desconhecido"}`,
      },
      { status: 500 },
    )
  }
}
