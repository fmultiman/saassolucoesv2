import { NextRequest, NextResponse } from "next/server"
import { getCurrentApiUser, requireAdminApiUser } from "@/lib/api-auth"
import { invalidateUserCache } from "@/lib/services/user-service"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export async function DELETE(_request: NextRequest, context: { params: Promise<unknown> }) {
  const authError = await requireAdminApiUser()
  if (authError) return authError

  try {
    const { id: userId } = (await context.params) as { id: string }
    const { user: currentUser } = await getCurrentApiUser()

    if (currentUser?.id === userId) {
      return NextResponse.json({ error: "Nao e permitido excluir o proprio usuario admin." }, { status: 400 })
    }

    const supabase = createServiceRoleClient()

    const { error: profileError } = await supabase.from("profiles").delete().eq("id", userId)
    if (profileError) {
      console.error("Erro ao excluir perfil do usuario:", profileError)
      return NextResponse.json({ error: "Erro ao excluir perfil do usuario." }, { status: 500 })
    }

    const { error: publicUserError } = await supabase.from("users").delete().eq("id", userId)
    if (publicUserError) {
      console.error("Erro ao excluir usuario da tabela public.users:", publicUserError)
      return NextResponse.json({ error: "Erro ao excluir usuario da base publica." }, { status: 500 })
    }

    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(userId)
    if (authDeleteError) {
      console.error("Erro ao excluir usuario do Auth:", authDeleteError)
      return NextResponse.json({ error: authDeleteError.message || "Erro ao excluir usuario do Auth." }, { status: 500 })
    }

    await invalidateUserCache(userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao processar exclusao de usuario:", error)
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 })
  }
}
