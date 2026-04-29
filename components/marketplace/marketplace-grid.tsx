"use client"

import { MarketplaceCard } from "@/components/marketplace/marketplace-card"
import type { MarketplaceProduct } from "@/components/marketplace/marketplace-data"

interface MarketplaceGridProps {
  products: MarketplaceProduct[]
  isPublicView?: boolean
  isLoggedIn?: boolean
}

export function MarketplaceGrid({ products, isPublicView = false, isLoggedIn = false }: MarketplaceGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-xl font-medium">Nenhuma solução encontrada</h3>
        <p className="mt-2 text-muted-foreground">Tente ajustar seus filtros ou busca</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <MarketplaceCard key={product.id} product={product} isPublicView={isPublicView} isLoggedIn={isLoggedIn} />
      ))}
    </div>
  )
}
