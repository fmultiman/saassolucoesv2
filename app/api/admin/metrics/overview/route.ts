import { NextResponse } from "next/server"

import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { requireAdminApiUser } from "@/lib/api-auth"

export async function GET() {
  const authError = await requireAdminApiUser()
  if (authError) return authError

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
