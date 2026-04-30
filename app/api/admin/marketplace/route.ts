import { NextResponse } from "next/server"
import { z } from "zod"
import { requireAdmin } from "@/lib/auth/requireAdmin"
import { apiErrorResponse, badRequestError, logApiError } from "@/lib/errors"
import { logInfo } from "@/lib/logger"
import {
  getMarketplaceFallbackAdminItems,
  getMarketplaceItemsFromDatabase,
  isMarketplaceTableMissingError,
  mapRowToAdminMarketplaceItem,
  mapMutationInputToRow,
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

async function getExistingMetrics(id: string) {
  const supabase = createServiceRoleClient()
  const { data, error } = await supabase
    .from("marketplace_items")
    .select("views, clicks, activations, last_access")
    .eq("id", id)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}

export async function GET() {
  try {
    await requireAdmin()

    try {
      const items = await getMarketplaceItemsFromDatabase()
      return NextResponse.json(items)
    } catch (error) {
      if (!isMarketplaceTableMissingError(error)) {
        throw error
      }
    }

    return NextResponse.json(getMarketplaceFallbackAdminItems())
  } catch (error) {
    logApiError("api/admin/marketplace GET", error)
    return apiErrorResponse(error)
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await requireAdmin()
    const payload = mutationSchema.parse((await request.json()) as MarketplaceMutationInput)
    const supabase = createServiceRoleClient()

    let existingMetrics = null
    try {
      existingMetrics = await getExistingMetrics(payload.id)
    } catch (error) {
      if (!isMarketplaceTableMissingError(error)) {
        throw error
      }
      throw badRequestError("Tabela marketplace_items ainda nao foi criada.", undefined, "MARKETPLACE_TABLE_MISSING")
    }

    const row = mapMutationInputToRow({
      ...payload,
      views: payload.views ?? existingMetrics?.views ?? 0,
      clicks: payload.clicks ?? existingMetrics?.clicks ?? 0,
      activations: payload.activations ?? existingMetrics?.activations ?? 0,
      lastAccess: payload.lastAccess ?? existingMetrics?.last_access ?? null,
    })

    const { data, error } = await supabase.from("marketplace_items").upsert(row).select("*").single()

    if (error) {
      throw error
    }

    logInfo("ADMIN_MARKETPLACE_UPSERT", {
      adminId: currentUser.profile.id,
      marketplaceItemId: payload.id,
    })

    return NextResponse.json(mapRowToAdminMarketplaceItem(data), { status: 201 })
  } catch (error) {
    logApiError("api/admin/marketplace POST", error)
    return apiErrorResponse(error)
  }
}
