import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const supabase = createServerClient(await cookies())
    const { code } = await params

    if (!code) {
      return NextResponse.json({ error: "Código do plano não fornecido" }, { status: 400 })
    }

    const { data, error } = await supabase.from("plans").select("*").eq("code", code).single()

    if (error) {
      console.error("Erro ao buscar plano:", error)
      return NextResponse.json({ error: "Erro ao buscar plano" }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Plano não encontrado" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
