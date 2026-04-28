"use client"

import { useEffect, useMemo, useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { BarChart2, LineChart, PieChart, ArrowUp, ArrowRight, Download, Filter, Calendar, ArrowDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCurrentUser } from "@/hooks/use-current-user"

type ApiSolution = {
  id: string | number
  name: string
  description: string | null
  category: string | null
  is_active: boolean | null
}

type SolutionMetric = {
  nome: string
  metricas: {
    interacoes: string
    tempoEconomizado: string
    taxaResolucao: string
  }
  tendencia: string
  positivo: boolean
}

export default function MetricasPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [solutions, setSolutions] = useState<ApiSolution[]>([])
  const [planId, setPlanId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, loading: userLoading } = useCurrentUser()

  useEffect(() => {
    async function loadMetrics() {
      if (userLoading) return

      try {
        setLoading(true)
        setError(null)

        let resolvedPlanId = null
        if (user?.id) {
          const userResponse = await fetch(`/api/users/${user.id}`)
          if (userResponse.ok) {
            const userData = await userResponse.json()
            resolvedPlanId = userData.plan_id
            setPlanId(userData.plan_id ?? null)
          }
        }

        const url = resolvedPlanId ? `/api/solutions/active?planId=${resolvedPlanId}` : "/api/solutions/active"
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Erro ao buscar solucoes: ${response.status}`)
        }

        const data = (await response.json()) as ApiSolution[]
        setSolutions(data)
      } catch (loadError) {
        console.error("Erro ao carregar metricas:", loadError)
        setError("Nao foi possivel carregar as metricas reais neste momento.")
        setSolutions([])
      } finally {
        setLoading(false)
      }
    }

    loadMetrics()
  }, [user?.id, userLoading])

  const categorias = useMemo(() => {
    return new Set(solutions.map((solution) => solution.category || "geral")).size
  }, [solutions])

  const metricas = [
    {
      titulo: "Automacoes Ativas",
      valor: loading ? "--" : solutions.length.toString(),
      variacao: solutions.length > 0 ? "Catalogo carregado" : "Sem solucoes ativas",
      positivo: solutions.length > 0,
      neutro: solutions.length === 0,
    },
    {
      titulo: "Mensagens Enviadas",
      valor: "Pendente",
      variacao: "Aguardando modelagem operacional",
      positivo: false,
      neutro: true,
    },
    {
      titulo: "Tempo Economizado",
      valor: planId ? `Plano #${planId}` : "Sem plano",
      variacao: planId ? "Disponibilidade ligada ao plano" : "Sem restricao de plano",
      positivo: false,
      neutro: true,
    },
    {
      titulo: "Taxa de Engajamento",
      valor: loading ? "--" : `${categorias}`,
      variacao: categorias > 0 ? "Categorias detectadas" : "Nenhuma categoria encontrada",
      positivo: categorias > 0,
      neutro: categorias === 0,
    },
  ]

  const solucoes: SolutionMetric[] = useMemo(() => {
    return solutions.slice(0, 6).map((solution) => ({
      nome: solution.name,
      metricas: {
        interacoes: "Pendente",
        tempoEconomizado: "Pendente",
        taxaResolucao: solution.category || "geral",
      },
      tendencia: "Sem historico operacional ainda",
      positivo: false,
    }))
  }, [solutions])

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
                <h1 className="text-3xl font-bold tracking-tight">Desempenho e Metricas</h1>
                <p className="text-muted-foreground">Acompanhe o desempenho das suas solucoes inteligentes.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" disabled>
                  <Calendar className="mr-2 h-4 w-4" />
                  Periodo
                </Button>
                <Button variant="outline" size="sm" disabled>
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
                <Button size="sm" disabled>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {metricas.map((metrica, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{metrica.titulo}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrica.valor}</div>
                    <div className="flex items-center pt-1">
                      {metrica.neutro ? (
                        <ArrowRight className="mr-1 h-3 w-3 text-muted-foreground" />
                      ) : metrica.positivo ? (
                        <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
                      ) : (
                        <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
                      )}
                      <span className={metrica.neutro ? "text-muted-foreground" : metrica.positivo ? "text-green-500" : "text-red-500"}>
                        {metrica.variacao}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Tabs defaultValue="geral">
              <TabsList>
                <TabsTrigger value="geral">Visao Geral</TabsTrigger>
                <TabsTrigger value="solucoes">Por Solucao</TabsTrigger>
                <TabsTrigger value="tendencias">Tendencias</TabsTrigger>
              </TabsList>
              <TabsContent value="geral" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Desempenho Geral</CardTitle>
                    <CardDescription>Metricas consolidadas das APIs ja conectadas para o usuario logado.</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="flex h-full items-center justify-center">
                      <div className="flex flex-col items-center">
                        <BarChart2 className="h-16 w-16 text-muted-foreground opacity-50" />
                        <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
                          A camada grafica continua aqui, mas os numeros exibidos acima agora usam apenas sessao,
                          plano e solucoes ativas reais. Series historicas ainda nao existem no banco.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Select defaultValue="30d" disabled>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Periodo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">Ultimos 7 dias</SelectItem>
                        <SelectItem value="30d">Ultimos 30 dias</SelectItem>
                        <SelectItem value="90d">Ultimos 90 dias</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" disabled>
                      Detalhes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="solucoes" className="space-y-4">
                {loading && <div className="h-40 rounded-lg bg-muted animate-pulse" />}
                {!loading &&
                  solucoes.map((solucao, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{solucao.nome}</CardTitle>
                        <CardDescription>Metricas de desempenho especificas</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-6 md:grid-cols-3">
                          {Object.entries(solucao.metricas).map(([chave, valor], idx) => (
                            <div key={idx} className="space-y-1">
                              <p className="text-sm font-medium">
                                {chave === "interacoes"
                                  ? "Interacoes"
                                  : chave === "tempoEconomizado"
                                    ? "Tempo Economizado"
                                    : "Categoria Base"}
                              </p>
                              <p className="text-2xl font-bold">{valor}</p>
                              <div className="flex items-center">
                                <ArrowRight className="mr-1 h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">{solucao.tendencia}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 h-60">
                          <div className="flex h-full items-center justify-center">
                            <div className="flex flex-col items-center">
                              <LineChart className="h-12 w-12 text-muted-foreground opacity-50" />
                              <p className="mt-2 text-center text-sm text-muted-foreground">
                                Esta visualizacao recebera curvas reais quando houver historico operacional por solucao.
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" disabled>
                          Ver Relatorio Completo
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                {!loading && solucoes.length === 0 && (
                  <Card>
                    <CardContent className="py-10 text-center text-muted-foreground">
                      Nenhuma solucao ativa disponivel para montar metricas por solucao.
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              <TabsContent value="tendencias" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Analise de Tendencias</CardTitle>
                    <CardDescription>Projecoes e tendencias dependem de historico de eventos, que ainda nao foi modelado.</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="flex h-full items-center justify-center">
                      <div className="flex flex-col items-center">
                        <PieChart className="h-16 w-16 text-muted-foreground opacity-50" />
                        <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
                          Esta aba foi mantida no layout, mas sem dados ficticios. Quando tivermos execucoes e eventos
                          persistidos, ela pode voltar a mostrar tendencias reais.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Select defaultValue="30d" disabled>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Periodo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30d">Proximos 30 dias</SelectItem>
                        <SelectItem value="90d">Proximos 90 dias</SelectItem>
                        <SelectItem value="180d">Proximos 180 dias</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" disabled>
                      Detalhes
                    </Button>
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
