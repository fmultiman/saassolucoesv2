import { NextResponse } from "next/server"
import { z } from "zod"
import { requireAdmin } from "@/lib/auth/requireAdmin"
import { apiErrorResponse, badRequestError, notFoundError, logApiError } from "@/lib/errors"
import { logInfo } from "@/lib/logger"
import {
  isMarketplaceTableMissingError,
  mapMutationInputToRow,
  mapRowToAdminMarketplaceItem,
  type MarketplaceMutationInput,
} from "@/lib/services/marketplace-service"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

const mutationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  fullDescription: z.string().min(1),
  category: z.string().min(1),
  relatedArea: z.string().min(1),
  minPlan: z.string().min(1),
  status: z.string().min(1),
  clientAction: z.string().min(1),
  showInstitutional: z.boolean(),
  showDashboard: z.boolean(),
  type: z.string().min(1),
  categories: z.array(z.string().min(1)).min(1),
  requiresLogin: z.boolean(),
  displayStatus: z.string().min(1),
  views: z.number().int().nonnegative().optional(),
  clicks: z.number().int().nonnegative().optional(),
  activations: z.number().int().nonnegative().optional(),
  lastAccess: z.string().nullable().optional(),
})

async function getMarketplaceRow(id: string) {
  const supabase = createServiceRoleClient()
  const { data, error } = await supabase.from("marketplace_items").select("*").eq("id", id).maybeSingle()

  if (error) {
    throw error
  }

  return data
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await context.params
    const row = await getMarketplaceRow(id)

    if (!row) {
      throw notFoundError("Item do marketplace nao encontrado.", "MARKETPLACE_ITEM_NOT_FOUND")
    }

    return NextResponse.json(mapRowToAdminMarketplaceItem(row))
  } catch (error) {
    logApiError("api/admin/marketplace/[id] GET", error)
    return apiErrorResponse(error)
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await requireAdmin()
    const { id } = await context.params
    const payload = mutationSchema.parse((await request.json()) as MarketplaceMutationInput)

    if (payload.id !== id) {
      throw badRequestError("O identificador do item nao confere com a rota.", undefined, "MARKETPLACE_ID_MISMATCH")
    }

    let existingRow = null
    try {
      existingRow = await getMarketplaceRow(id)
    } catch (error) {
      if (!isMarketplaceTableMissingError(error)) {
        throw error
      }
      throw badRequestError("Tabela marketplace_items ainda nao foi criada.", undefined, "MARKETPLACE_TABLE_MISSING")
    }

    if (!existingRow) {
      throw notFoundError("Item do marketplace nao encontrado.", "MARKETPLACE_ITEM_NOT_FOUND")
    }

    const supabase = createServiceRoleClient()
    const updateRow = mapMutationInputToRow({
      ...payload,
      views: payload.views ?? existingRow.views ?? 0,
      clicks: payload.clicks ?? existingRow.clicks ?? 0,
      activations: payload.activations ?? existingRow.activations ?? 0,
      lastAccess: payload.lastAccess ?? existingRow.last_access ?? null,
    })

    const { data, error } = await supabase.from("marketplace_items").upsert(updateRow).select("*").single()

    if (error) {
      throw error
    }

    logInfo("ADMIN_MARKETPLACE_UPDATE", {
      adminId: currentUser.profile.id,
      marketplaceItemId: id,
    })

    return NextResponse.json(mapRowToAdminMarketplaceItem(data))
  } catch (error) {
    logApiError("api/admin/marketplace/[id] PATCH", error)
    return apiErrorResponse(error)
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await requireAdmin()
    const { id } = await context.params
    const supabase = createServiceRoleClient()

    const { error } = await supabase.from("marketplace_items").delete().eq("id", id)

    if (error) {
      if (isMarketplaceTableMissingError(error)) {
        throw badRequestError("Tabela marketplace_items ainda nao foi criada.", undefined, "MARKETPLACE_TABLE_MISSING")
      }

      throw error
    }

    logInfo("ADMIN_MARKETPLACE_DELETE", {
      adminId: currentUser.profile.id,
      marketplaceItemId: id,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logApiError("api/admin/marketplace/[id] DELETE", error)
    return apiErrorResponse(error)
  }
}
