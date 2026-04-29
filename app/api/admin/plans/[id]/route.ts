import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { requireAdmin } from "@/lib/auth/requireAdmin"
import { apiErrorResponse, badRequestError, logApiError, notFoundError } from "@/lib/errors"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

const planUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().nullable().optional(),
  price: z.number().nullable().optional(),
  code: z.string().min(1).optional(),
  features: z.any().optional(),
  billing_cycle: z.string().nullable().optional(),
  interval: z.string().nullable().optional(),
  is_active: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  max_solutions: z.number().int().nullable().optional(),
  sort_order: z.number().int().optional(),
})

export async function GET(_request: NextRequest, context: { params: Promise<unknown> }) {
  try {
    await requireAdmin()
    const { id } = (await context.params) as { id: string }
    const planId = Number.parseInt(id, 10)

    if (Number.isNaN(planId)) {
      throw badRequestError("ID do plano invalido")
    }

    const supabase = createServiceRoleClient()
    const { data, error } = await supabase.from("plans").select("*").eq("id", planId).maybeSingle()

    if (error) {
      throw error
    }

    if (!data) {
      throw notFoundError("Plano nao encontrado")
    }

    return NextResponse.json(data)
  } catch (error) {
    logApiError("api/admin/plans/[id] GET", error)
    return apiErrorResponse(error)
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<unknown> }) {
  try {
    await requireAdmin()
    const { id } = (await context.params) as { id: string }
    const planId = Number.parseInt(id, 10)

    if (Number.isNaN(planId)) {
      throw badRequestError("ID do plano invalido")
    }

    const payload = planUpdateSchema.parse(await request.json())
    const supabase = createServiceRoleClient()
    const { data: existingPlan, error: existingPlanError } = await supabase.from("plans").select("*").eq("id", planId).maybeSingle()

    if (existingPlanError) {
      throw existingPlanError
    }

    if (!existingPlan) {
      throw notFoundError("Plano nao encontrado")
    }

    const nextBillingCycle = payload.billing_cycle !== undefined ? payload.billing_cycle : existingPlan.billing_cycle
    const nextInterval = payload.interval !== undefined ? payload.interval : nextBillingCycle === "anual" ? "year" : "month"

    const { data, error } = await supabase
      .from("plans")
      .update({
        ...payload,
        billing_cycle: nextBillingCycle,
        interval: nextInterval,
        updated_at: new Date().toISOString(),
      })
      .eq("id", planId)
      .select("*")
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    logApiError("api/admin/plans/[id] PATCH", error)
    return apiErrorResponse(error)
  }
}
