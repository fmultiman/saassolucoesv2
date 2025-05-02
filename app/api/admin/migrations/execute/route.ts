import { type NextRequest, NextResponse } from "next/server"
import { executeMigration } from "@/lib/services/migration-service"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação e permissões
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Verificar se o usuário é admin
    const { data: userData } = await supabase.from("users").select("user_type").eq("id", session.user.id).single()

    if (!userData || userData.user_type !== "admin") {
      return NextResponse.json({ error: "Acesso restrito a administradores" }, { status: 403 })
    }

    // Obter o nome do arquivo de migração do corpo da requisição
    const body = await request.json()
    const { filename } = body

    if (!filename) {
      return NextResponse.json({ error: "Nome do arquivo de migração não fornecido" }, { status: 400 })
    }

    // Executar a migração
    const result = await executeMigration(filename, session.user.id)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erro ao executar migração:", error)
    return NextResponse.json({ error: "Erro ao processar a solicitação" }, { status: 500 })
  }
}
