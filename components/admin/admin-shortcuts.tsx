"use client"

import Link from "next/link"
import { Users, AlertTriangle, Settings, CreditCard, FileText, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AdminShortcuts() {
  const shortcuts = [
    {
      icon: AlertTriangle,
      label: "Alertas Técnicos",
      href: "/admin/alertas",
      color: "text-destructive",
    },
    {
      icon: Users,
      label: "Usuários Recentes",
      href: "/admin/usuarios",
      color: "text-primary",
    },
    {
      icon: Zap,
      label: "Soluções com Erro",
      href: "/admin/solucoes-ativas",
      color: "text-warning",
    },
    {
      icon: CreditCard,
      label: "Assinaturas Vencendo",
      href: "/admin/planos",
      color: "text-info",
    },
    {
      icon: FileText,
      label: "Novos Modelos",
      href: "/admin/modelos",
      color: "text-success",
    },
    {
      icon: Settings,
      label: "Configurações API",
      href: "/admin/configuracoes?tab=api",
      color: "text-muted-foreground",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {shortcuts.map((shortcut, index) => (
        <Button
          key={index}
          variant="outline"
          size="lg"
          className="h-auto flex-col items-start gap-1 p-4 justify-start text-left"
          asChild
        >
          <Link href={shortcut.href}>
            <shortcut.icon className={`h-5 w-5 ${shortcut.color}`} />
            <div className="font-medium">{shortcut.label}</div>
          </Link>
        </Button>
      ))}
    </div>
  )
}
