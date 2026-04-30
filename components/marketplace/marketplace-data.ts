import { getMarketplaceFallbackCardProducts } from "@/lib/services/marketplace-service"

export interface MarketplaceProduct {
  id: string
  name: string
  description: string
  categories: string[]
  status: "included" | "premium" | "external" | "coming-soon" | "available"
  requiresLogin: boolean
  image?: string
}

export const marketplaceProducts: MarketplaceProduct[] = getMarketplaceFallbackCardProducts()
