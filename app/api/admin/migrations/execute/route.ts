import { type NextRequest, NextResponse } from "next/server"
import { getCurrentApiUser, requireAdminApiUser } from "@/lib/api-auth"
import { apiErrorResponse, badRequestError, logApiError } from "@/lib/errors"
import { executeMigration } from "@/lib/services/migration-service"

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdminApiUser()
    if (authError) return authError

    const body = await request.json()
    const { filename } = body

    if (!filename) {
      throw badRequestError("Nome do arquivo de migracao nao fornecido", undefined, "MIGRATION_FILENAME_REQUIRED")
    }

    const { user } = await getCurrentApiUser()

    if (!user) {
      throw badRequestError("Sessao invalida para executar migracao", undefined, "INVALID_ADMIN_SESSION")
    }

    const result = await executeMigration(filename, user.id)

    return NextResponse.json(result)
  } catch (error) {
    logApiError("api/admin/migrations/execute POST", error)
    return apiErrorResponse(error, "Erro ao processar a solicitacao")
  }
}
