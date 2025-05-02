import { createServiceRoleClient } from "../lib/supabase/service-role"
import fs from "fs"
import path from "path"

async function runMigration() {
  try {
    const supabase = createServiceRoleClient()

    // Ler arquivo de migração
    const migrationPath = path.join(process.cwd(), "migrations", "add_profile_fields.sql")
    const migrationSQL = fs.readFileSync(migrationPath, "utf8")

    console.log("Executando migração para adicionar campos de perfil...")

    // Executar SQL
    const { error } = await supabase.rpc("execute_sql", { sql: migrationSQL })

    if (error) {
      throw error
    }

    console.log("Migração concluída com sucesso!")
  } catch (error) {
    console.error("Erro ao executar migração:", error)
    process.exit(1)
  }
}

runMigration()
