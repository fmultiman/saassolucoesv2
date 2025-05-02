import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminMetricsOverview } from "@/components/admin/admin-metrics-overview"
import { AdminMetricsUsage } from "@/components/admin/admin-metrics-usage"
import { AdminMetricsPerformance } from "@/components/admin/admin-metrics-performance"

export const metadata = {
  title: "Métricas | Admin Dashboard",
  description: "Visualização detalhada de métricas e análises do sistema",
}

export default function AdminMetricsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Métricas e Análises</h1>
        <p className="text-muted-foreground">
          Visualize e analise o desempenho da plataforma e comportamento dos usuários
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="usage">Uso da Plataforma</TabsTrigger>
          <TabsTrigger value="performance">Desempenho</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <AdminMetricsOverview />
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <AdminMetricsUsage />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <AdminMetricsPerformance />
        </TabsContent>
      </Tabs>
    </div>
  )
}
