import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { code: string } }) {
  try {
    const supabase = createClient()
    const { code } = params

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
