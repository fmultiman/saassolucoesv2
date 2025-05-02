"use client"

import { Check, ChevronRight, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export function AdminOptimizationSuggestions() {
  const suggestions = [
    {
      title: "Otimizar integrações WhatsApp",
      description: "Reduzir tempo de resposta em 30%",
      progress: 25,
      href: "/admin/configuracoes/integracoes",
    },
    {
      title: "Atualizar modelos de IA",
      description: "Melhorar precisão das respostas",
      progress: 60,
      href: "/admin/modelos",
    },
    {
      title: "Configurar fallbacks automáticos",
      description: "Reduzir falhas de comunicação",
      progress: 10,
      href: "/admin/configuracoes/fallbacks",
    },
    {
      title: "Revisar limites de planos",
      description: "Otimizar uso de recursos",
      progress: 80,
      href: "/admin/planos",
    },
  ]

  return (
    <div className="space-y-4">
      {suggestions.map((suggestion, index) => (
        <div key={index} className="flex items-start gap-4">
          <div className="mt-0.5 rounded-full bg-primary/20 p-1">
            <Lightbulb className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{suggestion.title}</p>
              <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                <a href={suggestion.href}>
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Ver detalhes</span>
                </a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{suggestion.description}</p>
            <div className="flex items-center gap-2">
              <Progress value={suggestion.progress} className="h-1" />
              <span className="text-xs font-medium">{suggestion.progress}%</span>
            </div>
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-full">
        <Check className="mr-2 h-4 w-4" />
        Implementar todas
      </Button>
    </div>
  )
}
