import { NextResponse } from "next/server"
import { z } from "zod"
import { requireAdminApiUser } from "@/lib/api-auth"
import { apiErrorResponse, logApiError } from "@/lib/errors"
import { logInfo } from "@/lib/logger"
import { resolvePlanFromDatabase } from "@/lib/plan-utils"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

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
  plan: z.string().optional(),
})

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authError = await requireAdminApiUser()
    if (authError) return authError

    const { id: userId } = await params
    const validData = profileUpdateSchema.parse(await request.json())

    logInfo("ADMIN_USER_PROFILE_UPDATE_REQUEST", {
      userId,
      fields: Object.keys(validData),
    })

    const supabase = createServiceRoleClient()
    const { status, plan, name, ...profileData } = validData
    const resolvedPlan = plan ? await resolvePlanFromDatabase(plan) : null

    const { error: userError } = await supabase
      .from("users")
      .update({
        ...(status ? { status } : {}),
        ...(resolvedPlan ? { plan: resolvedPlan.code, plan_id: resolvedPlan.id } : {}),
        ...(name ? { name } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (userError) {
      throw userError
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          ...(name ? { name } : {}),
          ...profileData,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      )

    if (profileError) {
      throw profileError
    }

    logInfo("ADMIN_USER_PROFILE_UPDATE_SUCCESS", { userId })

    return NextResponse.json({
      success: true,
      message: "Perfil atualizado com sucesso",
    })
  } catch (error) {
    logApiError("api/admin/users/[id]/profile PUT", error)
    return apiErrorResponse(error)
  }
}
