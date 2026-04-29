"use client"

import { useState } from "react"
import { MarketplaceFilters } from "@/components/marketplace/marketplace-filters"
import { MarketplaceGrid } from "@/components/marketplace/marketplace-grid"
import { marketplaceProducts } from "@/components/marketplace/marketplace-data"
import { useCurrentUser } from "@/hooks/use-current-user"

interface MarketplaceContentProps {
  isPublic?: boolean
}

export function MarketplaceContent({ isPublic = false }: MarketplaceContentProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const { user, loading } = useCurrentUser()

  const isLoggedIn = !loading && !!user

  const filteredProducts = marketplaceProducts.filter((product) => {
    const matchesFilter = activeFilter === "all" || product.categories.includes(activeFilter)
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{isPublic ? "Recursos Adicionais" : "Marketplace"}</h1>
        <p className="text-muted-foreground">
          {isPublic
            ? "Conheça as soluções e integrações disponíveis para expandir seu negócio"
            : "Expanda sua plataforma com soluções adicionais, templates e integrações"}
        </p>
      </div>

      <MarketplaceFilters
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <MarketplaceGrid products={filteredProducts} isPublicView={isPublic} isLoggedIn={isLoggedIn} />
    </div>
  )
}
