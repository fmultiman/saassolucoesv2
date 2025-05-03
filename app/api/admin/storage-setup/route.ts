import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { setupUserContentBucket } from "@/lib/supabase/storage-setup"

export async function POST(request: Request) {
  try {
    const supabase = createServerClient(cookies())

    // Verificar autenticação e permissões de admin
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
      return NextResponse.json({ error: "Permissão negada" }, { status: 403 })
    }

    // Configurar bucket de armazenamento
    const result = await setupUserContentBucket()

    if (!result.success) {
      return NextResponse.json({ error: "Erro ao configurar armazenamento" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Armazenamento configurado com sucesso" })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
