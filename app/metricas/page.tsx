"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { BarChart2, LineChart, PieChart, ArrowUp, ArrowDown, Download, Filter, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Remova a importação de Viewport e generateViewport
// Remova a exportação de viewport

export default function MetricasPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const metricas = [
    {
      titulo: "Automações Ativas",
      valor: "2",
      anterior: "1",
      variacao: "+100%",
      positivo: true,
    },
    {
      titulo: "Mensagens Enviadas",
      valor: "1.248",
      anterior: "1.023",
      variacao: "+22%",
      positivo: true,
    },
    {
      titulo: "Tempo Economizado",
      valor: "18h",
      anterior: "15h",
      variacao: "+20%",
      positivo: true,
    },
    {
      titulo: "Taxa de Engajamento",
      valor: "68%",
      anterior: "63%",
      variacao: "+5%",
      positivo: true,
    },
  ]

  const solucoes = [
    {
      nome: "Atendente Virtual",
      metricas: {
        interacoes: 487,
        tempoEconomizado: "12h",
        taxaResolucao: "78%",
      },
      tendencia: "+12%",
      positivo: true,
    },
    {
      nome: "Recuperação de Clientes",
      metricas: {
        interacoes: 156,
        conversoes: 23,
        taxaEngajamento: "34%",
      },
      tendencia: "+8%",
      positivo: true,
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${sidebarCollapsed ? "md:ml-[70px]" : "md:ml-64"}`}
      >
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Desempenho e Métricas</h1>
                <p className="text-muted-foreground">Acompanhe o desempenho das suas soluções inteligentes.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Período
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
                <Button size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {metricas.map((metrica, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{metrica.titulo}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrica.valor}</div>
                    <div className="flex items-center pt-1">
                      {metrica.positivo ? (
                        <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
                      ) : (
                        <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
                      )}
                      <span className={metrica.positivo ? "text-green-500" : "text-red-500"}>
                        {metrica.variacao} vs. mês anterior
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Tabs defaultValue="geral">
              <TabsList>
                <TabsTrigger value="geral">Visão Geral</TabsTrigger>
                <TabsTrigger value="solucoes">Por Solução</TabsTrigger>
                <TabsTrigger value="tendencias">Tendências</TabsTrigger>
              </TabsList>
              <TabsContent value="geral" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Desempenho Geral</CardTitle>
                    <CardDescription>Métricas consolidadas de todas as soluções</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="flex h-full items-center justify-center">
                      <div className="flex flex-col items-center">
                        <BarChart2 className="h-16 w-16 text-muted-foreground opacity-50" />
                        <p className="mt-2 text-center text-sm text-muted-foreground">
                          Gráfico de desempenho geral das soluções
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Select defaultValue="30d">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Período" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">Últimos 7 dias</SelectItem>
                        <SelectItem value="30d">Últimos 30 dias</SelectItem>
                        <SelectItem value="90d">Últimos 90 dias</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">Detalhes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="solucoes" className="space-y-4">
                {solucoes.map((solucao, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{solucao.nome}</CardTitle>
                      <CardDescription>Métricas de desempenho específicas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 md:grid-cols-3">
                        {Object.entries(solucao.metricas).map(([chave, valor], idx) => (
                          <div key={idx} className="space-y-1">
                            <p className="text-sm font-medium">
                              {chave === "interacoes"
                                ? "Interações"
                                : chave === "tempoEconomizado"
                                  ? "Tempo Economizado"
                                  : chave === "taxaResolucao"
                                    ? "Taxa de Resolução"
                                    : chave === "conversoes"
                                      ? "Conversões"
                                      : "Taxa de Engajamento"}
                            </p>
                            <p className="text-2xl font-bold">{valor}</p>
                            <div className="flex items-center">
                              {solucao.positivo ? (
                                <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
                              ) : (
                                <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
                              )}
                              <span className={solucao.positivo ? "text-green-500" : "text-red-500"}>
                                {solucao.tendencia} vs. mês anterior
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 h-60">
                        <div className="flex h-full items-center justify-center">
                          <div className="flex flex-col items-center">
                            <LineChart className="h-12 w-12 text-muted-foreground opacity-50" />
                            <p className="mt-2 text-center text-sm text-muted-foreground">
                              Gráfico de desempenho da solução
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Ver Relatório Completo
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="tendencias" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Análise de Tendências</CardTitle>
                    <CardDescription>Projeções e tendências baseadas em dados históricos</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="flex h-full items-center justify-center">
                      <div className="flex flex-col items-center">
                        <PieChart className="h-16 w-16 text-muted-foreground opacity-50" />
                        <p className="mt-2 text-center text-sm text-muted-foreground">
                          Gráfico de tendências e projeções
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Select defaultValue="30d">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Período" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30d">Próximos 30 dias</SelectItem>
                        <SelectItem value="90d">Próximos 90 dias</SelectItem>
                        <SelectItem value="180d">Próximos 180 dias</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">Detalhes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
