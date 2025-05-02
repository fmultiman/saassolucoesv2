import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminNotificationsList } from "@/components/admin/admin-notifications-list"
import { Plus } from "lucide-react"

export const metadata = {
  title: "Notificações",
  description: "Gerencie alertas e notificações da plataforma.",
}

export default function AdminNotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notificações</h2>
          <p className="text-muted-foreground">Gerencie alertas e notificações da plataforma.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Notificação
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notificações e Alertas</CardTitle>
          <CardDescription>Lista de todas as notificações da plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminNotificationsList />
        </CardContent>
      </Card>
    </div>
  )
}
