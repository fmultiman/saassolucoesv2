import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export async function POST(request: Request) {
  try {
    const supabaseAdmin = createServiceRoleClient()

    const { email } = await request.json()

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email inválido ou não fornecido" }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()

    // 🔍 Verificar na tabela `public.users`
    const { data: existingUser, error: userTableError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle()

    if (userTableError) {
      console.error("Erro ao verificar na tabela users:", userTableError)
      return NextResponse.json({ error: "Erro ao consultar base de dados" }, { status: 500 })
    }

    if (existingUser) {
      return NextResponse.json({ exists: true, source: "database" })
    }

    // 🔍 Verificar no Supabase Auth (sem filtro, com find manual)
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()

    if (authError) {
      console.error("Erro ao listar usuários do auth:", authError)
      return NextResponse.json({ error: "Erro ao consultar autenticação" }, { status: 500 })
    }

    const existsInAuth = authUsers?.users?.some((user) => user.email?.toLowerCase() === normalizedEmail)

    if (existsInAuth) {
      return NextResponse.json({ exists: true, source: "auth" })
    }

    // ✅ Email livre
    return NextResponse.json({ exists: false })
  } catch (error: any) {
    console.error("Erro geral:", error)
    return NextResponse.json({ error: error.message || "Erro ao verificar email" }, { status: 500 })
  }
}
