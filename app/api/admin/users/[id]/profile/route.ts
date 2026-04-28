import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { z } from "zod"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { requireAdminApiUser } from "@/lib/api-auth"

// Schema de validação para atualização de perfil
const profileUpdateSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100).optional(),
  bio: z.string().max(500).nullable().optional(),
  phone: z.string().max(20).nullable().optional(),
  job_title: z.string().max(100).nullable().optional(),
  company: z.string().max(100).nullable().optional(),
  website: z.string().url().nullable().optional(),
  location: z.string().max(100).nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
  preferences: z.record(z.any()).nullable().optional(),
  status: z.enum(["active", "inactive", "suspended"]).optional(),
  plan: z.enum(["free", "basic", "pro", "enterprise"]).optional(),
})

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdminApiUser()
  if (authError) return authError

  try {
    const { id: userId } = await params
    const supabase = createServerClient(await cookies())

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

    // Obter dados do corpo da requisição
    const body = await request.json()
    console.log("Dados recebidos para atualização (admin):", body)

    // Validar dados
    const validationResult = profileUpdateSchema.safeParse(body)

    if (!validationResult.success) {
      console.error("Erro de validação:", validationResult.error.format())
      return NextResponse.json({ error: "Dados inválidos", details: validationResult.error.format() }, { status: 400 })
    }

    const validData = validationResult.data
    console.log("Dados validados (admin):", validData)

    // Usar o cliente com role de serviço para atualizar qualquer usuário
    const supabaseAdmin = createServiceRoleClient()

    // Atualizar perfil no banco de dados
    const { error } = await supabaseAdmin
      .from("users")
      .update({
        ...validData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      console.error("Erro ao atualizar perfil (admin):", error)
      return NextResponse.json({ error: "Erro ao atualizar perfil", details: error }, { status: 500 })
    }

    console.log("Perfil atualizado com sucesso (admin)")
    return NextResponse.json({ success: true, message: "Perfil atualizado com sucesso" })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
