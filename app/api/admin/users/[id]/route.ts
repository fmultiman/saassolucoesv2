import { NextRequest, NextResponse } from "next/server"
import { getCurrentApiUser, requireAdminApiUser } from "@/lib/api-auth"
import { z } from "zod"
import { apiErrorResponse, badRequestError, logApiError, notFoundError } from "@/lib/errors"
import { invalidateUserCache } from "@/lib/services/user-service"
import { resolvePlanFromDatabase } from "@/lib/plan-utils"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

const adminUserUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  status: z.enum(["active", "inactive", "suspended"]).optional(),
  plan: z.string().min(1).optional(),
})

export async function GET(_request: NextRequest, context: { params: Promise<unknown> }) {
  const authError = await requireAdminApiUser()
  if (authError) return authError

  try {
    const { id: userId } = (await context.params) as { id: string }
    const supabase = createServiceRoleClient()

    const { data, error } = await supabase
      .from("users")
      .select("id, email, name, user_type, plan, plan_id, onboarding_completed, status, created_at, updated_at, last_sign_in_at, active_solutions")
      .eq("id", userId)
      .maybeSingle()

    if (error) {
      throw error
    }

    if (!data) {
      throw notFoundError("Usuario nao encontrado")
    }

    return NextResponse.json(data)
  } catch (error) {
    logApiError("api/admin/users/[id] GET", error)
    return apiErrorResponse(error)
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<unknown> }) {
  const authError = await requireAdminApiUser()
  if (authError) return authError

  try {
    const { id: userId } = (await context.params) as { id: string }
    const payload = adminUserUpdateSchema.parse(await request.json())
    const supabase = createServiceRoleClient()
    const { data: existingUser, error: existingUserError } = await supabase.from("users").select("*").eq("id", userId).maybeSingle()

    if (existingUserError) {
      throw existingUserError
    }

    if (!existingUser) {
      throw notFoundError("Usuario nao encontrado")
    }

    if (Object.keys(payload).length === 0) {
      throw badRequestError("Nenhum campo valido foi informado para atualizacao")
    }

    const resolvedPlan = payload.plan ? await resolvePlanFromDatabase(payload.plan) : null
    const nextName = payload.name ?? existingUser.name

    const { data, error } = await supabase
      .from("users")
      .update({
        ...(payload.name !== undefined ? { name: payload.name } : {}),
        ...(payload.status !== undefined ? { status: payload.status } : {}),
        ...(resolvedPlan ? { plan: resolvedPlan.code, plan_id: resolvedPlan.id } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select("id, email, name, user_type, plan, plan_id, onboarding_completed, status, created_at, updated_at, last_sign_in_at, active_solutions")
      .single()

    if (error) {
      throw error
    }

    if (payload.name !== undefined) {
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: userId,
            email: existingUser.email,
            name: nextName,
          },
          { onConflict: "id" },
        )

      if (profileError) {
        throw profileError
      }
    }

    await invalidateUserCache(userId)

    return NextResponse.json(data)
  } catch (error) {
    logApiError("api/admin/users/[id] PATCH", error)
    return apiErrorResponse(error)
  }
}

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
    logApiError("api/admin/users/[id] DELETE", error)
    return apiErrorResponse(error)
  }
}
