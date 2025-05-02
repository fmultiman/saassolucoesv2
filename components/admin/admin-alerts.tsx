"use client"

import { AlertCircle, AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const alerts = [
  {
    id: 1,
    title: "Falha na integração WhatsApp",
    description: "A conexão com a API do WhatsApp está instável",
    severity: "high",
    time: "30 minutos atrás",
  },
  {
    id: 2,
    title: "Erro no processamento de pagamentos",
    description: "3 transações não foram concluídas",
    severity: "high",
    time: "2 horas atrás",
  },
  {
    id: 3,
    title: "Lentidão no servidor",
    description: "Tempo de resposta acima do normal",
    severity: "medium",
    time: "4 horas atrás",
  },
  {
    id: 4,
    title: "Atualização pendente",
    description: "Nova versão disponível para deploy",
    severity: "low",
    time: "1 dia atrás",
  },
  {
    id: 5,
    title: "Catálogo de soluções atualizado",
    description: "47 soluções disponíveis em 8 categorias",
    severity: "low",
    time: "2 dias atrás",
  },
]

export function AdminAlerts() {
  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={cn(
            "flex items-start gap-3 rounded-lg border p-3",
            alert.severity === "high" && "border-destructive/50 bg-destructive/10",
            alert.severity === "medium" && "border-warning/50 bg-warning/10",
            alert.severity === "low" && "border-muted",
          )}
        >
          <div className="mt-0.5">
            {alert.severity === "high" ? (
              <AlertCircle className="h-4 w-4 text-destructive" />
            ) : alert.severity === "medium" ? (
              <AlertTriangle className="h-4 w-4 text-warning" />
            ) : (
              <Info className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium">{alert.title}</h4>
            <p className="text-xs text-muted-foreground">{alert.description}</p>
            <p className="mt-1 text-xs text-muted-foreground">{alert.time}</p>
          </div>
          <Button variant="ghost" size="sm" className="h-7 px-2">
            Resolver
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-full">
        Ver todos os alertas
      </Button>
    </div>
  )
}
