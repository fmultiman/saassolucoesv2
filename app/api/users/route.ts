import { NextResponse } from "next/server"
import { z } from "zod"
import { requireAdmin } from "@/lib/auth/requireAdmin"
import { requireUser } from "@/lib/auth/requireUser"
import { resolvePlanFromDatabase } from "@/lib/plan-utils"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { apiErrorResponse, badRequestError, forbiddenError, logApiError, notFoundError } from "@/lib/errors"
import { syncAuthUserRecord, userExists } from "@/lib/users"

const createUserSchema = z.object({
  nome: z.string().min(2).max(100),
  email: z.string().email(),
  tipoAcesso: z.enum(["admin", "client"]).default("client"),
  plano: z.string().min(1).default("gratuito"),
  forceCreate: z.boolean().optional().default(false),
})

const updateUserSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2).max(100).optional(),
  onboarding_completed: z.boolean().optional(),
  status: z.enum(["active", "inactive", "suspended"]).optional(),
  plan: z.string().min(1).optional(),
})

export async function GET() {
  try {
    await requireAdmin()

    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from("users")
      .select("id, email, name, user_type, plan, plan_id, onboarding_completed, status, created_at, updated_at, last_sign_in_at")
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(data ?? [])
  } catch (error) {
    return apiErrorResponse(error)
  }
}

export async function POST(request: Request) {
  try {
    const payload = createUserSchema.parse(await request.json())
    const currentUser = await requireUser()
    const normalizedEmail = payload.email.trim().toLowerCase()
    const isAdmin = currentUser.profile.user_type === "admin"

    if (!isAdmin) {
      if (currentUser.auth.email?.toLowerCase() !== normalizedEmail || payload.tipoAcesso === "admin" || payload.forceCreate) {
        throw forbiddenError()
      }

      const synced = await syncAuthUserRecord(currentUser.auth, {
        name: payload.nome,
        plan: payload.plano,
        userType: "client",
      })

      return NextResponse.json({ message: "Perfil sincronizado com sucesso", userId: synced.user.id, action: "synced" })
    }

    if ((await userExists(normalizedEmail)) && !payload.forceCreate) {
      throw badRequestError("Usuario com este email ja existe")
    }

    const supabase = createServiceRoleClient()
    const temporaryPassword = generateTemporaryPassword()

    const { data: createdUser, error: authError } = await supabase.auth.admin.createUser({
      email: normalizedEmail,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        name: payload.nome,
      },
    })

    if (authError || !createdUser.user) {
      throw authError ?? new Error("Erro ao criar usuario no auth")
    }

    const synced = await syncAuthUserRecord(createdUser.user, {
      name: payload.nome,
      userType: payload.tipoAcesso,
      plan: payload.tipoAcesso === "client" ? payload.plano : "gratuito",
      status: "active",
    })

    return NextResponse.json(
      {
        message: "Usuario criado com sucesso",
        userId: synced.user.id,
        action: "created",
      },
      { status: 201 },
    )
  } catch (error) {
    logApiError("api/users POST", error)
    return apiErrorResponse(error)
  }
}

export async function PATCH(request: Request) {
  try {
    const currentUser = await requireUser()
    const payload = updateUserSchema.parse(await request.json())
    const targetUserId = payload.id ?? currentUser.profile.id
    const isAdmin = currentUser.profile.user_type === "admin"

    if (!isAdmin && targetUserId !== currentUser.profile.id) {
      throw forbiddenError()
    }

    const updateData: Record<string, unknown> = {}

    if (payload.name !== undefined) {
      updateData.name = payload.name
    }

    if (payload.onboarding_completed !== undefined) {
      updateData.onboarding_completed = payload.onboarding_completed
    }

    if (isAdmin && payload.status !== undefined) {
      updateData.status = payload.status
    }

    if (Object.keys(updateData).length === 0) {
      throw badRequestError("Nenhum campo valido foi informado para atualizacao")
    }

    const supabase = createServiceRoleClient()

    const { data: existingUser, error: existingUserError } = await supabase.from("users").select("*").eq("id", targetUserId).maybeSingle()
    if (existingUserError) {
      throw existingUserError
    }
    if (!existingUser) {
      throw notFoundError("Usuario nao encontrado")
    }

    if (isAdmin && payload.plan !== undefined) {
      const resolvedPlan = await resolvePlanFromDatabase(payload.plan)
      updateData.plan = resolvedPlan.code
      updateData.plan_id = resolvedPlan.id
    }

    const { data, error } = await supabase
      .from("users")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", targetUserId)
      .select("id, email, name, user_type, plan, plan_id, onboarding_completed, status, created_at, updated_at, last_sign_in_at")
      .single()

    if (error) {
      throw error
    }

    if (payload.name !== undefined) {
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: targetUserId,
            name: payload.name,
            email: existingUser.email,
          },
          { onConflict: "id" },
        )

      if (profileError) {
        throw profileError
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    logApiError("api/users PATCH", error)
    return apiErrorResponse(error)
  }
}

function generateTemporaryPassword(length = 16) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%*"
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}
