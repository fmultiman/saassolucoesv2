import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { apiErrorResponse, logApiError } from "@/lib/errors"
import {
  filterMarketplaceItemsByScope,
  getMarketplaceFallbackAdminItems,
  getMarketplaceItemsFromDatabase,
  isMarketplaceTableMissingError,
  mapAdminItemsToCardProducts,
} from "@/lib/services/marketplace-service"

const scopeSchema = z.enum(["institutional", "dashboard", "all"]).default("all")

export async function GET(request: NextRequest) {
  try {
    const scope = scopeSchema.parse(request.nextUrl.searchParams.get("scope") ?? "all")

    try {
      const items = await getMarketplaceItemsFromDatabase()
      return NextResponse.json(mapAdminItemsToCardProducts(filterMarketplaceItemsByScope(items, scope)))
    } catch (error) {
      if (!isMarketplaceTableMissingError(error)) {
        throw error
      }
    }

    const fallbackItems = filterMarketplaceItemsByScope(getMarketplaceFallbackAdminItems(), scope)
    return NextResponse.json(mapAdminItemsToCardProducts(fallbackItems))
  } catch (error) {
    logApiError("api/marketplace GET", error)
    return apiErrorResponse(error)
  }
}
