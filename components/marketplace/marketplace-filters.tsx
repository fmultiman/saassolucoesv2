"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface MarketplaceFiltersProps {
  activeFilter: string
  setActiveFilter: (filter: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export function MarketplaceFilters({
  activeFilter,
  setActiveFilter,
  searchQuery,
  setSearchQuery,
}: MarketplaceFiltersProps) {
  const filters = [
    { id: "all", label: "Todos" },
    { id: "premium", label: "Soluções Premium" },
    { id: "template", label: "Templates Inteligentes" },
    { id: "integration", label: "Integrações Externas" },
    { id: "service", label: "Serviços Personalizados" },
    { id: "capacity", label: "Capacidade Extra" },
    { id: "recommended", label: "Recomendados" },
  ]

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar soluções..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={activeFilter === filter.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
