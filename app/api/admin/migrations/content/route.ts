import { type NextRequest, NextResponse } from "next/server"
import { readMigrationFile } from "@/lib/services/migration-service"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação e permissões
    const cookieStore = await cookies()
    const supabase = createServerClient(cookieStore)

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

    // Obter o nome do arquivo da query string
    const filename = request.nextUrl.searchParams.get("filename")

    if (!filename) {
      return NextResponse.json({ error: "Nome do arquivo não fornecido" }, { status: 400 })
    }

    // Ler o conteúdo do arquivo
    const content = await readMigrationFile(filename)

    return NextResponse.json({ content })
  } catch (error) {
    console.error("Erro ao ler arquivo de migração:", error)
    return NextResponse.json({ error: "Erro ao processar a solicitação" }, { status: 500 })
  }
}
