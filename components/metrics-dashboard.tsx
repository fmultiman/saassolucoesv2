"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"

export default function MetricsDashboard() {
  const performanceMetrics = [
    {
      name: "Tempo de Carregamento",
      current: "3.2s",
      target: "1.5s",
      progress: 45,
      trend: "up",
      description: "Tempo médio de carregamento inicial da página",
    },
    {
      name: "First Contentful Paint",
      current: "1.8s",
      target: "0.8s",
      progress: 60,
      trend: "up",
      description: "Tempo até o primeiro conteúdo visível",
    },
    {
      name: "Time to Interactive",
      current: "4.5s",
      target: "2.0s",
      progress: 40,
      trend: "neutral",
      description: "Tempo até a página se tornar interativa",
    },
    {
      name: "Bundle Size",
      current: "320KB",
      target: "200KB",
      progress: 65,
      trend: "up",
      description: "Tamanho total do JavaScript enviado ao cliente",
    },
  ]

  const userMetrics = [
    {
      name: "Taxa de Conversão",
      current: "2.8%",
      target: "5.0%",
      progress: 56,
      trend: "up",
      description: "Visitantes que se tornam usuários",
    },
    {
      name: "Retenção de Usuários",
      current: "68%",
      target: "85%",
      progress: 80,
      trend: "up",
      description: "Usuários que retornam após 30 dias",
    },
    {
      name: "Satisfação do Usuário",
      current: "4.2/5",
      target: "4.5/5",
      progress: 84,
      trend: "up",
      description: "Avaliação média dos usuários",
    },
    {
      name: "Taxa de Abandono",
      current: "32%",
      target: "15%",
      progress: 60,
      trend: "down",
      description: "Usuários que cancelam a assinatura",
    },
  ]

  const businessMetrics = [
    {
      name: "MRR",
      current: "R$ 15.200",
      target: "R$ 25.000",
      progress: 61,
      trend: "up",
      description: "Receita Mensal Recorrente",
    },
    {
      name: "CAC",
      current: "R$ 180",
      target: "R$ 120",
      progress: 67,
      trend: "down",
      description: "Custo de Aquisição de Cliente",
    },
    {
      name: "LTV",
      current: "R$ 1.200",
      target: "R$ 2.000",
      progress: 60,
      trend: "up",
      description: "Valor do Tempo de Vida do Cliente",
    },
    {
      name: "Churn Rate",
      current: "5.2%",
      target: "3.0%",
      progress: 58,
      trend: "down",
      description: "Taxa de cancelamento mensal",
    },
  ]

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <ArrowUpRight className="h-4 w-4 text-green-500" />
    if (trend === "down") return <ArrowDownRight className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  const renderMetrics = (metrics: any[]) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                {getTrendIcon(metric.trend)}
              </div>
              <CardDescription className="text-xs">{metric.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span className="text-2xl font-bold">{metric.current}</span>
                <span className="text-sm text-muted-foreground">Meta: {metric.target}</span>
              </div>
              <Progress value={metric.progress} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <Tabs defaultValue="performance">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="user">Experiência do Usuário</TabsTrigger>
        <TabsTrigger value="business">Negócio</TabsTrigger>
      </TabsList>

      <TabsContent value="performance">
        <Card>
          <CardHeader>
            <CardTitle>Métricas de Performance</CardTitle>
            <CardDescription>Acompanhamento das melhorias de performance da aplicação</CardDescription>
          </CardHeader>
          <CardContent>{renderMetrics(performanceMetrics)}</CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="user">
        <Card>
          <CardHeader>
            <CardTitle>Métricas de Experiência do Usuário</CardTitle>
            <CardDescription>Indicadores relacionados à satisfação e engajamento dos usuários</CardDescription>
          </CardHeader>
          <CardContent>{renderMetrics(userMetrics)}</CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="business">
        <Card>
          <CardHeader>
            <CardTitle>Métricas de Negócio</CardTitle>
            <CardDescription>Indicadores financeiros e de crescimento do negócio</CardDescription>
          </CardHeader>
          <CardContent>{renderMetrics(businessMetrics)}</CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
