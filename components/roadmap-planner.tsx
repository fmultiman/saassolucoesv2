"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock } from "lucide-react"

type Task = {
  id: string
  title: string
  description: string
  complexity: "Baixa" | "Média" | "Alta"
  impact: "Baixo" | "Médio" | "Alto"
  status: "Pendente" | "Em Progresso" | "Concluído"
  category: "Performance" | "UX" | "Segurança" | "Funcionalidade" | "Arquitetura" | "Monetização"
}

export default function RoadmapPlanner() {
  const [tasks, setTasks] = useState<Task[]>([
    // Fase 1: Melhorias Imediatas (1-2 semanas)
    {
      id: "1-1",
      title: "Implementar Server Components",
      description: "Converter componentes-chave para Server Components para melhorar performance",
      complexity: "Média",
      impact: "Alto",
      status: "Pendente",
      category: "Performance",
    },
    {
      id: "1-2",
      title: "Adicionar esqueletos de carregamento",
      description: "Implementar estados de carregamento para todos os componentes que buscam dados",
      complexity: "Baixa",
      impact: "Médio",
      status: "Pendente",
      category: "UX",
    },
    {
      id: "1-3",
      title: "Validação com Zod",
      description: "Implementar validação consistente em APIs e formulários",
      complexity: "Média",
      impact: "Alto",
      status: "Pendente",
      category: "Segurança",
    },

    // Fase 2: Melhorias de Médio Prazo (3-4 semanas)
    {
      id: "2-1",
      title: "Sistema de paginação",
      description: "Implementar paginação nas listas de soluções, planos e usuários",
      complexity: "Média",
      impact: "Médio",
      status: "Pendente",
      category: "Performance",
    },
    {
      id: "2-2",
      title: "Tratamento de erros centralizado",
      description: "Criar sistema unificado para tratamento de erros",
      complexity: "Média",
      impact: "Alto",
      status: "Pendente",
      category: "Arquitetura",
    },
    {
      id: "2-3",
      title: "Onboarding personalizado",
      description: "Criar fluxo de onboarding baseado no plano do usuário",
      complexity: "Alta",
      impact: "Alto",
      status: "Pendente",
      category: "UX",
    },
    {
      id: "2-4",
      title: "Histórico de uso",
      description: "Implementar sistema de histórico de uso das soluções",
      complexity: "Média",
      impact: "Médio",
      status: "Pendente",
      category: "Funcionalidade",
    },

    // Fase 3: Melhorias de Longo Prazo (5-8 semanas)
    {
      id: "3-1",
      title: "Análise avançada no dashboard",
      description: "Implementar gráficos e métricas mais robustas para administradores",
      complexity: "Alta",
      impact: "Alto",
      status: "Pendente",
      category: "Funcionalidade",
    },
    {
      id: "3-2",
      title: "Sistema de notificações",
      description: "Adicionar sistema de alertas para administradores",
      complexity: "Alta",
      impact: "Médio",
      status: "Pendente",
      category: "Funcionalidade",
    },
    {
      id: "3-3",
      title: "Exportação de dados",
      description: "Permitir exportação de relatórios em CSV e PDF",
      complexity: "Média",
      impact: "Médio",
      status: "Pendente",
      category: "Funcionalidade",
    },
    {
      id: "3-4",
      title: "Sistema de trial",
      description: "Implementar período de teste para soluções premium",
      complexity: "Alta",
      impact: "Alto",
      status: "Pendente",
      category: "Monetização",
    },
    {
      id: "3-5",
      title: "Programa de indicação",
      description: "Criar sistema de referral que recompense usuários",
      complexity: "Alta",
      impact: "Médio",
      status: "Pendente",
      category: "Monetização",
    },
    {
      id: "3-6",
      title: "Testes automatizados",
      description: "Implementar testes unitários, de integração e e2e",
      complexity: "Alta",
      impact: "Alto",
      status: "Pendente",
      category: "Arquitetura",
    },
  ])

  const phases = [
    { id: "fase1", name: "Fase 1: Imediata", timeframe: "1-2 semanas" },
    { id: "fase2", name: "Fase 2: Médio Prazo", timeframe: "3-4 semanas" },
    { id: "fase3", name: "Fase 3: Longo Prazo", timeframe: "5-8 semanas" },
  ]

  const getTasksByPhase = (phaseId: string) => {
    if (phaseId === "fase1") return tasks.filter((task) => task.id.startsWith("1-"))
    if (phaseId === "fase2") return tasks.filter((task) => task.id.startsWith("2-"))
    if (phaseId === "fase3") return tasks.filter((task) => task.id.startsWith("3-"))
    return []
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Baixa":
        return "bg-green-100 text-green-800"
      case "Média":
        return "bg-yellow-100 text-yellow-800"
      case "Alta":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "Baixo":
        return "bg-blue-100 text-blue-800"
      case "Médio":
        return "bg-purple-100 text-purple-800"
      case "Alto":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Performance":
        return "bg-orange-100 text-orange-800"
      case "UX":
        return "bg-pink-100 text-pink-800"
      case "Segurança":
        return "bg-red-100 text-red-800"
      case "Funcionalidade":
        return "bg-blue-100 text-blue-800"
      case "Arquitetura":
        return "bg-purple-100 text-purple-800"
      case "Monetização":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="w-full">
      <Tabs defaultValue="fase1">
        <TabsList className="grid w-full grid-cols-3">
          {phases.map((phase) => (
            <TabsTrigger key={phase.id} value={phase.id}>
              <div className="flex flex-col items-center">
                <span className="font-medium">{phase.name}</span>
                <span className="text-xs text-muted-foreground">{phase.timeframe}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {phases.map((phase) => (
          <TabsContent key={phase.id} value={phase.id}>
            <Card>
              <CardHeader>
                <CardTitle>{phase.name}</CardTitle>
                <CardDescription>Melhorias planejadas para implementação em {phase.timeframe}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getTasksByPhase(phase.id).map((task) => (
                    <div key={task.id} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {task.status === "Concluído" ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-amber-500" />
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge className={getComplexityColor(task.complexity)}>Complexidade: {task.complexity}</Badge>
                        <Badge className={getImpactColor(task.impact)}>Impacto: {task.impact}</Badge>
                        <Badge className={getCategoryColor(task.category)}>{task.category}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
