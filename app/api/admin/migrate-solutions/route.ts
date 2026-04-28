import { NextResponse } from "next/server"
import { migrateSolutions } from "@/lib/services/migration-service"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { requireAdminMaintenanceMode } from "@/lib/admin-maintenance"
import { requireAdminApiUser } from "@/lib/api-auth"

export async function POST() {
  const maintenanceModeError = requireAdminMaintenanceMode()
  if (maintenanceModeError) return maintenanceModeError
  const authError = await requireAdminApiUser()
  if (authError) return authError

  try {
    // Primeiro, vamos tentar forçar uma atualização do cache do schema
    const supabase = createServiceRoleClient()

    try {
      // Tente executar uma função para recarregar o cache do schema
      await supabase.rpc("reload_schema_cache")
      console.log("Cache do schema recarregado")
    } catch (cacheError) {
      console.log("Não foi possível recarregar o cache do schema:", cacheError)
      // Continue mesmo se não conseguir recarregar o cache
    }

    // Agora execute a migração
    const result = await migrateSolutions()

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 500 })
    }
  } catch (error) {
    console.error("Erro na rota de migração:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao processar a requisição de migração.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
