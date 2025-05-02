"use client"

import { MarketplaceCard } from "@/components/marketplace/marketplace-card"
import type { MarketplaceProduct } from "@/components/marketplace/marketplace-data"

interface MarketplaceGridProps {
  products: MarketplaceProduct[]
  isPublic?: boolean
}

export function MarketplaceGrid({ products, isPublic = false }: MarketplaceGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium">Nenhuma solução encontrada</h3>
        <p className="text-muted-foreground mt-2">Tente ajustar seus filtros ou busca</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <MarketplaceCard key={product.id} product={product} isPublic={isPublic} />
      ))}
    </div>
  )
}
