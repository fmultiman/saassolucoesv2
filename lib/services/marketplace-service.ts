import type { Database } from "@/lib/supabase/types"
import type { MarketplaceProduct } from "@/components/marketplace/marketplace-data"
import type { MarketplaceSeedItem } from "@/lib/marketplace/marketplace-seed"
import { marketplaceSeedItems } from "@/lib/marketplace/marketplace-seed"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export type MarketplaceItemRow = Database["public"]["Tables"]["marketplace_items"]["Row"]

export type AdminMarketplaceItem = {
  id: string
  name: string
  description: string
  fullDescription: string
  category: string
  relatedArea: string
  minPlan: string
  status: string
  clientAction: string
  showInstitutional: boolean
  showDashboard: boolean
  views: number
  clicks: number
  activations: number
  lastAccess: string | null
  type: string
  categories: string[]
  requiresLogin: boolean
  displayStatus: string
}

export type MarketplaceVisibilityScope = "institutional" | "dashboard" | "all"

export type MarketplaceMutationInput = Omit<AdminMarketplaceItem, "views" | "clicks" | "activations" | "lastAccess"> & {
  views?: number
  clicks?: number
  activations?: number
  lastAccess?: string | null
}

function normalizeStringArray(value: unknown, fallback: string[] = []) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.length > 0) : fallback
}

function asBoolean(value: boolean | null | undefined, fallback = false) {
  return typeof value === "boolean" ? value : fallback
}

function asNumber(value: number | null | undefined, fallback = 0) {
  return typeof value === "number" ? value : fallback
}

export function mapSeedToAdminMarketplaceItem(item: MarketplaceSeedItem): AdminMarketplaceItem {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    fullDescription: item.fullDescription,
    category: item.category,
    relatedArea: item.relatedArea,
    minPlan: item.minPlan,
    status: item.status,
    clientAction: item.clientAction,
    showInstitutional: item.showInstitutional,
    showDashboard: item.showDashboard,
    views: item.views,
    clicks: item.clicks,
    activations: item.activations,
    lastAccess: item.lastAccess,
    type: item.type,
    categories: item.categories,
    requiresLogin: item.requiresLogin,
    displayStatus: item.displayStatus,
  }
}

export function mapRowToAdminMarketplaceItem(row: MarketplaceItemRow): AdminMarketplaceItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    fullDescription: row.full_description ?? row.description,
    category: row.category ?? "service",
    relatedArea: row.related_area ?? "all-areas",
    minPlan: row.min_plan ?? "free",
    status: row.status ?? "active",
    clientAction: row.client_action ?? "Ver mais",
    showInstitutional: asBoolean(row.show_institutional, true),
    showDashboard: asBoolean(row.show_dashboard, true),
    views: asNumber(row.views, 0),
    clicks: asNumber(row.clicks, 0),
    activations: asNumber(row.activations, 0),
    lastAccess: row.last_access,
    type: row.type ?? "service",
    categories: normalizeStringArray(row.categories, row.category ? [row.category] : ["service"]),
    requiresLogin: asBoolean(row.requires_login, false),
    displayStatus: row.display_status ?? "available",
  }
}

export function mapAdminMarketplaceItemToCardProduct(item: AdminMarketplaceItem): MarketplaceProduct {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    categories: item.categories.length > 0 ? item.categories : [item.category],
    status: (item.displayStatus as MarketplaceProduct["status"]) ?? "available",
    requiresLogin: item.requiresLogin,
  }
}

export function mapMutationInputToRow(input: MarketplaceMutationInput): Database["public"]["Tables"]["marketplace_items"]["Insert"] {
  return {
    id: input.id,
    name: input.name,
    description: input.description,
    type: input.type,
    categories: input.categories,
    status: input.status,
    requires_login: input.requiresLogin,
    full_description: input.fullDescription,
    category: input.category,
    related_area: input.relatedArea,
    min_plan: input.minPlan,
    client_action: input.clientAction,
    show_institutional: input.showInstitutional,
    show_dashboard: input.showDashboard,
    display_status: input.displayStatus,
    views: input.views ?? 0,
    clicks: input.clicks ?? 0,
    activations: input.activations ?? 0,
    last_access: input.lastAccess ?? null,
  }
}

export function getMarketplaceFallbackAdminItems() {
  return marketplaceSeedItems.map(mapSeedToAdminMarketplaceItem)
}

export function getMarketplaceFallbackCardProducts() {
  return getMarketplaceFallbackAdminItems().map(mapAdminMarketplaceItemToCardProduct)
}

export async function getMarketplaceItemsFromDatabase() {
  const supabase = createServiceRoleClient()
  const { data, error } = await supabase.from("marketplace_items").select("*").order("created_at", { ascending: true })

  if (error) {
    throw error
  }

  return (data ?? []).map(mapRowToAdminMarketplaceItem)
}

export function filterMarketplaceItemsByScope(items: AdminMarketplaceItem[], scope: MarketplaceVisibilityScope) {
  if (scope === "institutional") {
    return items.filter((item) => item.showInstitutional && item.status !== "hidden")
  }

  if (scope === "dashboard") {
    return items.filter((item) => item.showDashboard && item.status !== "hidden")
  }

  return items
}

export function mapAdminItemsToCardProducts(items: AdminMarketplaceItem[]) {
  return items.map(mapAdminMarketplaceItemToCardProduct)
}

export function isMarketplaceTableMissingError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false
  }

  const candidate = error as { code?: string; message?: string }
  return candidate.code === "42P01" || candidate.message?.toLowerCase().includes("marketplace_items") === true
}
