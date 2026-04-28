import { NextResponse } from "next/server"

import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { requireAdminApiUser } from "@/lib/api-auth"

function getMonthRange(monthOffset: number) {
  const start = new Date()
  start.setDate(1)
  start.setHours(0, 0, 0, 0)
  start.setMonth(start.getMonth() + monthOffset)

  const end = new Date(start)
  end.setMonth(end.getMonth() + 1)

  return {
    label: start.toISOString().slice(0, 7),
    start: start.toISOString(),
    end: end.toISOString(),
  }
}

export async function GET() {
  const authError = await requireAdminApiUser()
  if (authError) return authError

  const supabase = createServiceRoleClient()
  const ranges = Array.from({ length: 7 }).map((_, index) => getMonthRange(index - 6))

  const points = await Promise.all(
    ranges.map(async (range) => {
      const [{ count: usuarios }, { count: solucoes }] = await Promise.all([
        supabase
          .from("users")
          .select("id", { count: "exact", head: true })
          .gte("created_at", range.start)
          .lt("created_at", range.end),
        supabase
          .from("solutions")
          .select("id", { count: "exact", head: true })
          .gte("created_at", range.start)
          .lt("created_at", range.end),
      ])

      return {
        mes: range.label,
        usuarios: usuarios ?? 0,
        solucoes: solucoes ?? 0,
      }
    }),
  )

  return NextResponse.json({
    meses: points.map((point) => point.mes),
    usuarios: points.map((point) => point.usuarios),
    solucoes: points.map((point) => point.solucoes),
  })
}
