import { type NextRequest, NextResponse } from "next/server"
import { requireAdminApiUser } from "@/lib/api-auth"
import { apiErrorResponse, badRequestError, logApiError } from "@/lib/errors"
import { readMigrationFile } from "@/lib/services/migration-service"

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdminApiUser()
    if (authError) return authError

    const filename = request.nextUrl.searchParams.get("filename")

    if (!filename) {
      throw badRequestError("Nome do arquivo nao fornecido", undefined, "MIGRATION_FILENAME_REQUIRED")
    }

    const content = await readMigrationFile(filename)

    return NextResponse.json({ content })
  } catch (error) {
    logApiError("api/admin/migrations/content GET", error)
    return apiErrorResponse(error, "Erro ao processar a solicitacao")
  }
}
