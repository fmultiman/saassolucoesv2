import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { createServerClient } from "@/lib/supabase/server"

async function requireAdmin() {
  const supabase = createServerClient(await cookies())
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session) return false

  const { data: userData, error: userError } = await (supabase as any)
    .from("users")
    .select("user_type")
    .eq("id", session.user.id)
    .single()

  return !userError && userData?.user_type === "admin"
}

function getLastSevenMonths() {
  return Array.from({ length: 7 })
    .map((_, index) => {
      const date = new Date()
      date.setMonth(date.getMonth() - (6 - index))
      return date.toISOString().slice(0, 7)
    })
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const meses = getLastSevenMonths()

  return NextResponse.json({
    meses,
    interacoes: meses.map(() => 0),
  })
}
