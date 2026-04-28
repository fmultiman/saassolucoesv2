import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import fs from "fs/promises"
import path from "path"

export async function GET() {
  try {
    // Verificar autenticação
    const cookieStore = await cookies()
    const supabase = createServerClient(cookieStore)

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Verificar se o usuário é admin
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("user_type")
      .eq("id", session.user.id)
      .single()

    if (userError || userData?.user_type !== "admin") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    // Listar arquivos de migração
    const migrationsDir = path.join(process.cwd(), "migrations")
    let files = []

    try {
      const dirExists = await fs
        .access(migrationsDir)
        .then(() => true)
        .catch(() => false)

      if (dirExists) {
        files = await fs.readdir(migrationsDir)
        files = files.filter((file) => file.endsWith(".sql"))

        // Ordenar arquivos por nome (assumindo que começam com números)
        files.sort((a, b) => {
          // Extrair o número do início do nome do arquivo (se existir)
          const numA = a.match(/^(\d+)_/) ? Number.parseInt(a.match(/^(\d+)_/)?.[1] || "0") : 0
          const numB = b.match(/^(\d+)_/) ? Number.parseInt(b.match(/^(\d+)_/)?.[1] || "0") : 0

          return numA - numB
        })
      }
    } catch (error) {
      console.error("Erro ao listar arquivos de migração:", error)
    }

    // Obter histórico de migrações
    const { data: executedMigrations, error: migrationsError } = await supabase
      .from("migrations")
      .select("*")
      .order("executed_at", { ascending: false })

    if (migrationsError) {
      console.error("Erro ao obter histórico de migrações:", migrationsError)
    }

    return NextResponse.json({
      files,
      executedMigrations: executedMigrations || [],
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
