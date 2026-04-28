import dynamic from "next/dynamic"

// Componentes do dashboard
export const DashboardStats = dynamic(() => import("./admin/admin-overview-stats").then((mod) => mod.AdminOverviewStats), {
  loading: () => <div className="w-full h-64 rounded-lg bg-muted animate-pulse" />,
})

// Componentes de gráficos
export const AdminSolutionsChart = dynamic(() => import("./admin/admin-solutions-chart").then((mod) => mod.AdminSolutionsChart), {
  loading: () => <div className="w-full h-64 rounded-lg bg-muted animate-pulse" />,
})

export const AdminGrowthChart = dynamic(() => import("./admin/admin-growth-chart").then((mod) => mod.AdminGrowthChart), {
  loading: () => <div className="w-full h-64 rounded-lg bg-muted animate-pulse" />,
})

export const AdminInteractionsChart = dynamic(() => import("./admin/admin-interactions-chart").then((mod) => mod.AdminInteractionsChart), {
  loading: () => <div className="w-full h-48 rounded-lg bg-muted animate-pulse" />,
})

// Componentes do marketplace
export const MarketplaceGrid = dynamic(() => import("./marketplace/marketplace-grid").then((mod) => mod.MarketplaceGrid), {
  loading: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-64 rounded-lg bg-muted animate-pulse" />
      ))}
    </div>
  ),
})
