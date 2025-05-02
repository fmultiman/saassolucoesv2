"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Bell, CheckCircle, Info, Server, Settings, User, Users } from "lucide-react"

// Dados de exemplo para notificações
const notificationsData = [
  {
    id: 1,
    title: "Alerta de Sistema",
    message: "Uso de CPU acima de 80% nos últimos 15 minutos",
    timestamp: "Há 5 minutos",
    type: "system",
    priority: "high",
    read: false,
    icon: Server,
  },
  {
    id: 2,
    title: "Novo Usuário Registrado",
    message: "João Silva acabou de se registrar na plataforma",
    timestamp: "Há 15 minutos",
    type: "users",
    priority: "medium",
    read: false,
    icon: User,
  },
  {
    id: 3,
    title: "Atualização de Sistema",
    message: "Nova versão 2.5.0 disponível para implantação",
    timestamp: "Há 1 hora",
    type: "system",
    priority: "medium",
    read: true,
    icon: Settings,
  },
  {
    id: 4,
    title: "Limite de Uso Atingido",
    message: "Cliente Empresa ABC atingiu 90% do limite de uso",
    timestamp: "Há 3 horas",
    type: "users",
    priority: "medium",
    read: true,
    icon: AlertCircle,
  },
  {
    id: 5,
    title: "Manutenção Programada",
    message: "Manutenção programada para 15/07 às 23:00",
    timestamp: "Há 5 horas",
    type: "system",
    priority: "low",
    read: true,
    icon: Info,
  },
  {
    id: 6,
    title: "Novo Plano Adquirido",
    message: "Cliente XYZ Ltda. atualizou para o plano Enterprise",
    timestamp: "Há 1 dia",
    type: "users",
    priority: "medium",
    read: true,
    icon: CheckCircle,
  },
  {
    id: 7,
    title: "Relatório Semanal",
    message: "O relatório semanal de uso está disponível",
    timestamp: "Há 2 dias",
    type: "system",
    priority: "low",
    read: true,
    icon: Bell,
  },
  {
    id: 8,
    title: "Novos Usuários",
    message: "10 novos usuários se registraram esta semana",
    timestamp: "Há 3 dias",
    type: "users",
    priority: "low",
    read: true,
    icon: Users,
  },
]

type NotificationFilterType = "all" | "system" | "users"

interface AdminNotificationsListProps {
  filter?: NotificationFilterType
}

export function AdminNotificationsList({ filter = "all" }: AdminNotificationsListProps) {
  const [notifications, setNotifications] = useState(notificationsData)
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([])

  const filteredNotifications =
    filter === "all" ? notifications : notifications.filter((notification) => notification.type === filter)

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id))
    }
  }

  const handleSelect = (id: number) => {
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(selectedNotifications.filter((notificationId) => notificationId !== id))
    } else {
      setSelectedNotifications([...selectedNotifications, id])
    }
  }

  const handleMarkAsRead = () => {
    setNotifications(
      notifications.map((notification) =>
        selectedNotifications.includes(notification.id) ? { ...notification, read: true } : notification,
      ),
    )
    setSelectedNotifications([])
  }

  const handleDelete = () => {
    setNotifications(notifications.filter((notification) => !selectedNotifications.includes(notification.id)))
    setSelectedNotifications([])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select-all"
            checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
            onCheckedChange={handleSelectAll}
          />
          <label
            htmlFor="select-all"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Selecionar tudo
          </label>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleMarkAsRead} disabled={selectedNotifications.length === 0}>
            Marcar como lida
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete} disabled={selectedNotifications.length === 0}>
            Excluir
          </Button>
        </div>
      </div>

      {filteredNotifications.length > 0 ? (
        filteredNotifications.map((notification) => (
          <Card key={notification.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`notification-${notification.id}`}
                    checked={selectedNotifications.includes(notification.id)}
                    onCheckedChange={() => handleSelect(notification.id)}
                  />
                  <label
                    htmlFor={`notification-${notification.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {notification.title}
                  </label>
                </div>
              </CardTitle>
              <notification.icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <CardDescription>{notification.message}</CardDescription>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground justify-between">
              <span>{notification.timestamp}</span>
              {notification.read ? <Badge variant="secondary">Lida</Badge> : <Badge variant="default">Não lida</Badge>}
            </CardFooter>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Bell className="h-12 w-12 text-muted-foreground opacity-50" />
            <p className="mt-4 text-lg font-medium">Nenhuma notificação encontrada</p>
            <p className="text-sm text-muted-foreground">Não há notificações para exibir neste momento.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
