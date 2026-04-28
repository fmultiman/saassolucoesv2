import { NextResponse } from "next/server"
import { initializeStorage } from "@/lib/supabase/storage-init"
import { requireAdminApiUser } from "@/lib/api-auth"

export async function POST() {
  const authError = await requireAdminApiUser()
  if (authError) return authError

  try {
    const result = await initializeStorage()

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Erro ao inicializar storage:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
