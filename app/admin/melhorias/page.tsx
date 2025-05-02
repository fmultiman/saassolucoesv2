import type { Metadata } from "next"
import RoadmapPlanner from "@/components/roadmap-planner"
import ImplementationStrategy from "@/components/implementation-strategy"
import MetricsDashboard from "@/components/metrics-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Plano de Melhorias | SaaS Soluções",
  description: "Plano de implementação de melhorias para o SaaS Soluções",
}

export default function MelhoriasPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Plano de Melhorias</h1>

      <div className="mb-8">
        <p className="text-muted-foreground mb-4">
          Este plano detalha as melhorias identificadas para o SaaS Soluções, organizadas por prioridade e com métricas
          para acompanhamento do progresso.
        </p>
      </div>

      <Tabs defaultValue="roadmap" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="strategy">Estratégia</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
        </TabsList>

        <TabsContent value="roadmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Roadmap de Implementação</CardTitle>
              <CardDescription>Planejamento das melhorias organizadas em fases de implementação</CardDescription>
            </CardHeader>
            <CardContent>
              <RoadmapPlanner />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estratégia de Implementação</CardTitle>
              <CardDescription>Detalhamento técnico das abordagens para cada área de melhoria</CardDescription>
            </CardHeader>
            <CardContent>
              <ImplementationStrategy />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Acompanhamento</CardTitle>
              <CardDescription>Indicadores para monitorar o progresso e impacto das melhorias</CardDescription>
            </CardHeader>
            <CardContent>
              <MetricsDashboard />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
