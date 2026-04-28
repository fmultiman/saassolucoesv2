import { NextResponse } from "next/server"

export function requireAdminMaintenanceMode() {
  if (process.env.ENABLE_ADMIN_MAINTENANCE === "true") {
    return null
  }

  return NextResponse.json({ error: "Admin maintenance endpoints are disabled." }, { status: 404 })
}
