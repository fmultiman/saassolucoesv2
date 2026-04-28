import { NextResponse } from "next/server"

import { requireAdminApiUser } from "@/lib/api-auth"

function getLastSevenMonths() {
  return Array.from({ length: 7 })
    .map((_, index) => {
      const date = new Date()
      date.setMonth(date.getMonth() - (6 - index))
      return date.toISOString().slice(0, 7)
    })
}

export async function GET() {
  const authError = await requireAdminApiUser()
  if (authError) return authError

  const meses = getLastSevenMonths()

  return NextResponse.json({
    meses,
    interacoes: meses.map(() => 0),
  })
}
