import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { requireAdminApiUser } from "@/lib/api-auth"
import { apiErrorResponse, logApiError } from "@/lib/errors"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export async function GET() {
  try {
    const authError = await requireAdminApiUser()
    if (authError) return authError

    const supabase = createServiceRoleClient()
    const migrationsDir = path.join(process.cwd(), "migrations")
    let files: string[] = []

    try {
      const dirExists = await fs
        .access(migrationsDir)
        .then(() => true)
        .catch(() => false)

      if (dirExists) {
        files = await fs.readdir(migrationsDir)
        files = files.filter((file) => file.endsWith(".sql"))
        files.sort((a, b) => {
          const numA = a.match(/^(\d+)_/) ? Number.parseInt(a.match(/^(\d+)_/)?.[1] || "0", 10) : 0
          const numB = b.match(/^(\d+)_/) ? Number.parseInt(b.match(/^(\d+)_/)?.[1] || "0", 10) : 0
          return numA - numB
        })
      }
    } catch (error) {
      logApiError("api/admin/migrations LIST_FILES", error)
    }

    const { data: executedMigrations, error: migrationsError } = await supabase
      .from("migrations")
      .select("*")
      .order("executed_at", { ascending: false })

    if (migrationsError) {
      logApiError("api/admin/migrations HISTORY", migrationsError)
    }

    return NextResponse.json({
      files,
      executedMigrations: executedMigrations || [],
    })
  } catch (error) {
    logApiError("api/admin/migrations GET", error)
    return apiErrorResponse(error)
  }
}
