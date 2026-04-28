"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowRight,
  Bot,
  Clock3,
  MessageSquare,
  RefreshCcw,
  Sparkles,
  Users,
} from "lucide-react"

type ApiSolution = {
  id: string | number
  name: string
  description: string | null
  category: string | null
  is_active: boolean | null
}

type ActiveSolution = {
  id: string
  name: string
  description: string
  category: string
}

export default function InteracoesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [solutions, setSolutions] = useState<ActiveSolution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, loading: userLoading } = useCurrentUser()

  useEffect(() => {
    async function loadSolutions() {
      if (userLoading) return

      try {
        setLoading(true)
        setError(null)

        let planId = null
        if (user?.id) {
          const userResponse = await fetch(`/api/users/${user.id}`)
          if (userResponse.ok) {
            const userData = await userResponse.json()
            planId = userData.plan_id
          }
        }

        const url = planId ? `/api/solutions/active?planId=${planId}` : "/api/solutions/active"
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Erro ao buscar solucoes: ${response.status}`)
        }

        const data = (await response.json()) as ApiSolution[]
        setSolutions(
          data.map((solution) => ({
            id: solution.id.toString(),
            name: solution.name,
            description: solution.description || "Sem descricao cadastrada.",
            category: solution.category || "geral",
          })),
        )
      } catch (loadError) {
        console.error("Erro ao carregar contexto de interacoes:", loadError)
        setError("Nao foi possivel carregar as solucoes vinculadas ao seu plano agora.")
        setSolutions([])
      } finally {
        setLoading(false)
      }
    }

    loadSolutions()
  }, [user?.id, userLoading])

  const categorizedSolutions = useMemo(() => {
    return solutions.reduce<Record<string, number>>((acc, solution) => {
      acc[solution.category] = (acc[solution.category] || 0) + 1
      return acc
    }, {})
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
                <h1 className="text-3xl font-bold tracking-tight">Interacoes</h1>
                <p className="text-muted-foreground">
                  Estamos preparando esta area para exibir conversas e eventos reais das solucoes ativas.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" asChild>
                  <Link href="/minhas-solucoes">
                    <Bot className="mr-2 h-4 w-4" />
                    Ver minhas solucoes
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/solucoes">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Explorar catalogo
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Fonte de interacoes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">Pendente</p>
                  <p className="text-sm text-muted-foreground">
                    Ainda nao existe uma tabela/API dedicada para mensagens, atendimentos ou eventos por usuario.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Bot className="h-4 w-4 text-primary" />
                    Solucoes ativas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{loading ? "--" : solutions.length}</p>
                  <p className="text-sm text-muted-foreground">
                    Quantidade de solucoes disponiveis hoje para receber uma camada futura de interacoes.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Clock3 className="h-4 w-4 text-primary" />
                    Proximo passo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">Modelar eventos</p>
                  <p className="text-sm text-muted-foreground">
                    Quando ligarmos conversas, logs ou webhooks aqui, esta pagina ja fica pronta para consumir.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="resumo" className="space-y-4">
              <TabsList>
                <TabsTrigger value="resumo">Resumo</TabsTrigger>
                <TabsTrigger value="escopo">Escopo futuro</TabsTrigger>
              </TabsList>

              <TabsContent value="resumo">
                <Card>
                  <CardHeader>
                    <CardTitle>Estado atual da tela</CardTitle>
                    <CardDescription>
                      Removemos os dados ficticios para evitar leituras erradas sobre conversas que ainda nao existem no banco.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loading && <div className="h-28 rounded-lg bg-muted animate-pulse" />}

                    {!loading && error && (
                      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                        {error}
                      </div>
                    )}

                    {!loading && !error && solutions.length === 0 && (
                      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                        Seu plano atual ainda nao retornou solucoes ativas para servir de base a esta area.
                      </div>
                    )}

                    {!loading && !error && solutions.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(categorizedSolutions).map(([category, count]) => (
                            <Badge key={category} variant="outline">
                              {category} ({count})
                            </Badge>
                          ))}
                        </div>

                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                          {solutions.map((solution) => (
                            <div key={solution.id} className="rounded-lg border p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1">
                                  <p className="font-medium">{solution.name}</p>
                                  <p className="text-sm text-muted-foreground">{solution.description}</p>
                                </div>
                                <Badge variant="secondary" className="capitalize">
                                  {solution.category}
                                </Badge>
                              </div>
                              <div className="mt-4 flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Pronta para receber eventos reais</span>
                                <Button variant="ghost" size="sm" asChild>
                                  <Link href={`/solucao/${solution.id}`}>
                                    Abrir
                                    <ArrowRight className="ml-1 h-3 w-3" />
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="escopo">
                <Card>
                  <CardHeader>
                    <CardTitle>O que esta faltando conectar</CardTitle>
                    <CardDescription>
                      Esta tela deve voltar a crescer quando definirmos como armazenar o historico operacional das solucoes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center gap-2 font-medium">
                        <Users className="h-4 w-4 text-primary" />
                        Conversas por cliente
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Identificar quem interagiu, por qual canal, em qual horario e com qual solucao.
                      </p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center gap-2 font-medium">
                        <RefreshCcw className="h-4 w-4 text-primary" />
                        Status de atendimento
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Distinguir atendimentos automaticos, transferidos, concluidos e falhas operacionais.
                      </p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center gap-2 font-medium">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        Timeline auditavel
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Permitir busca, filtros e exportacao quando existir uma fonte persistida de eventos.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
