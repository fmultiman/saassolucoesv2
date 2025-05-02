import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminRevenueChart } from "@/components/admin/admin-revenue-chart"
import { AdminTransactionsList } from "@/components/admin/admin-transactions-list"
import { AdminRevenueStats } from "@/components/admin/admin-revenue-stats"
import { Download } from "lucide-react"

export const metadata = {
  title: "Faturamento",
  description: "Acompanhe a receita e transações da plataforma.",
}

export default function AdminBillingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Faturamento</h2>
          <p className="text-muted-foreground">Acompanhe a receita e transações da plataforma.</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      <AdminRevenueStats />

      <Card>
        <CardHeader>
          <CardTitle>Receita Mensal</CardTitle>
          <CardDescription>Evolução da receita nos últimos 12 meses.</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminRevenueChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
          <CardDescription>Lista das transações mais recentes na plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminTransactionsList />
        </CardContent>
      </Card>
    </div>
  )
}
