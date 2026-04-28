import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { createServiceRoleClient } from "@/lib/supabase/service-role"
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

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createServiceRoleClient()

  const [{ count: usuariosAtivos }, { count: solucoesAtivas }] = await Promise.all([
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase.from("solutions").select("id", { count: "exact", head: true }).eq("is_active", true),
  ])

  return NextResponse.json({
    usuariosAtivos: usuariosAtivos ?? 0,
    solucoesAtivas: solucoesAtivas ?? 0,
    interacoesTotais: 0,
    tempoMedioUso: 0,
    variacoes: {
      usuarios: 0,
      solucoes: 0,
      interacoes: 0,
      tempoUso: 0,
    },
  })
}
