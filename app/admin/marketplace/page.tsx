import { AdminMarketplaceManager } from "@/components/admin/admin-marketplace-manager"

export const metadata = {
  title: "Gerenciar Marketplace | SaaS Soluções",
  description: "Gerencie os produtos, integrações e serviços disponíveis no Marketplace",
}

export default function MarketplacePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Marketplace</h1>
        <p className="text-muted-foreground">
          Gerencie os produtos, integrações e serviços disponíveis no Marketplace da plataforma.
        </p>
      </div>
      <AdminMarketplaceManager />
    </div>
  )
}
