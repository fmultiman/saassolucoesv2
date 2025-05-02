import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminPlansList } from "@/components/admin/admin-plans-list"
import { AdminSubscriptionsStats } from "@/components/admin/admin-subscriptions-stats"

export const metadata = {
  title: "Planos e Assinaturas | Admin Dashboard",
  description: "Gerencie os planos disponíveis e assinaturas ativas",
}

export default function AdminPlansPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Planos e Assinaturas</h2>
          <p className="text-muted-foreground">Gerencie os planos disponíveis e assinaturas ativas.</p>
        </div>
      </div>

      <AdminSubscriptionsStats />

      <Card>
        <CardHeader>
          <CardTitle>Planos Disponíveis</CardTitle>
          <CardDescription>Lista de todos os planos disponíveis na plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminPlansList />
        </CardContent>
      </Card>
    </div>
  )
}
