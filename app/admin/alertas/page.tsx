import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminAlerts } from "@/components/admin/admin-alerts"

export const metadata = {
  title: "Alertas Técnicos",
  description: "Monitore e gerencie alertas do sistema.",
}

export default function AdminAlertsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Alertas Técnicos</h2>
          <p className="text-muted-foreground">Monitore e gerencie alertas do sistema.</p>
        </div>
        <Button>Configurar Alertas</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alertas Ativos</CardTitle>
          <CardDescription>Alertas que requerem atenção imediata.</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminAlerts />
        </CardContent>
      </Card>
    </div>
  )
}
