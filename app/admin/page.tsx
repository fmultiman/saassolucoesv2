import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminOverviewStats } from "@/components/admin/admin-overview-stats"
import { AdminSolutionsChart } from "@/components/admin/admin-solutions-chart"
import { AdminGrowthChart } from "@/components/admin/admin-growth-chart"
import { AdminAlerts } from "@/components/admin/admin-alerts"
import { AdminInteractionsChart } from "@/components/admin/admin-interactions-chart"
import { AdminShortcuts } from "@/components/admin/admin-shortcuts"
import { AdminOptimizationSuggestions } from "@/components/admin/admin-optimization-suggestions"

export const metadata = {
  title: "Visão Geral",
  description: "Painel administrativo para gerenciamento da plataforma SaaS Soluções.",
}

export default function AdminDashboard() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Visão Geral</h2>
          <p className="text-muted-foreground">Painel administrativo para gerenciamento da plataforma SaaS Soluções.</p>
        </div>
        <Tabs defaultValue="hoje" className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="hoje">Hoje</TabsTrigger>
            <TabsTrigger value="semana">Esta Semana</TabsTrigger>
            <TabsTrigger value="mes">Este Mês</TabsTrigger>
            <TabsTrigger value="ano">Este Ano</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <AdminOverviewStats />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="rounded-lg border bg-card text-card-foreground shadow lg:col-span-4">
          <div className="p-6">
            <div className="flex flex-col space-y-1.5">
              <h3 className="font-semibold leading-none tracking-tight">Soluções Mais Ativadas</h3>
              <p className="text-sm text-muted-foreground">
                As soluções mais populares entre os usuários da plataforma.
              </p>
            </div>
            <div className="pt-6">
              <AdminSolutionsChart />
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow lg:col-span-3">
          <div className="p-6">
            <div className="flex flex-col space-y-1.5">
              <h3 className="font-semibold leading-none tracking-tight">Crescimento Mensal</h3>
              <p className="text-sm text-muted-foreground">Crescimento da base de usuários nos últimos 6 meses.</p>
            </div>
            <div className="pt-6">
              <AdminGrowthChart />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card text-card-foreground shadow lg:col-span-1">
          <div className="p-6">
            <div className="flex flex-col space-y-1.5">
              <h3 className="font-semibold leading-none tracking-tight">Alertas Técnicos</h3>
              <p className="text-sm text-muted-foreground">Falhas e problemas que requerem atenção.</p>
            </div>
            <div className="pt-6">
              <AdminAlerts />
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow lg:col-span-2">
          <div className="p-6">
            <div className="flex flex-col space-y-1.5">
              <h3 className="font-semibold leading-none tracking-tight">Interações por Dia</h3>
              <p className="text-sm text-muted-foreground">Volume de interações na plataforma nos últimos 7 dias.</p>
            </div>
            <div className="pt-6">
              <AdminInteractionsChart />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card text-card-foreground shadow">
          <div className="p-6">
            <div className="flex flex-col space-y-1.5">
              <h3 className="font-semibold leading-none tracking-tight">Atalhos</h3>
              <p className="text-sm text-muted-foreground">Acesso rápido para áreas críticas da plataforma.</p>
            </div>
            <div className="pt-6">
              <AdminShortcuts />
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow">
          <div className="p-6">
            <div className="flex flex-col space-y-1.5">
              <h3 className="font-semibold leading-none tracking-tight">Sugestões de Otimização</h3>
              <p className="text-sm text-muted-foreground">Recomendações para melhorar o desempenho da plataforma.</p>
            </div>
            <div className="pt-6">
              <AdminOptimizationSuggestions />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
