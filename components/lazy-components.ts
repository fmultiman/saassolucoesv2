import dynamic from "next/dynamic"

// Componentes do dashboard
export const DashboardStats = dynamic(() => import("./dashboard-stats"), {
  loading: () => <div className="w-full h-64 rounded-lg bg-muted animate-pulse" />,
})

// Componentes de gráficos
export const AdminSolutionsChart = dynamic(() => import("./admin/admin-solutions-chart"), {
  loading: () => <div className="w-full h-64 rounded-lg bg-muted animate-pulse" />,
})

export const AdminGrowthChart = dynamic(() => import("./admin/admin-growth-chart"), {
  loading: () => <div className="w-full h-64 rounded-lg bg-muted animate-pulse" />,
})

export const AdminInteractionsChart = dynamic(() => import("./admin/admin-interactions-chart"), {
  loading: () => <div className="w-full h-48 rounded-lg bg-muted animate-pulse" />,
})

// Componentes do marketplace
export const MarketplaceGrid = dynamic(() => import("./marketplace/marketplace-grid"), {
  loading: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-64 rounded-lg bg-muted animate-pulse" />
      ))}
    </div>
  ),
})
