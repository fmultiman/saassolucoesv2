"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  CalendarClock,
  CalendarRange,
  Clock3,
  Rocket,
  Send,
  Settings2,
} from "lucide-react"

type ApiSolution = {
  id: string | number
  name: string
  description: string | null
  category: string | null
}

type ActiveSolution = {
  id: string
  name: string
  description: string
  category: string
}

export default function ProximosEnviosPage() {
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
        console.error("Erro ao carregar contexto de envios:", loadError)
        setError("Nao foi possivel carregar as solucoes vinculadas ao seu plano agora.")
        setSolutions([])
      } finally {
        setLoading(false)
      }
    }

    loadSolutions()
  }, [user?.id, userLoading])

  const highlightedSolutions = useMemo(() => solutions.slice(0, 6), [solutions])

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
                <h1 className="text-3xl font-bold tracking-tight">Proximos Envios</h1>
                <p className="text-muted-foreground">
                  Esta tela vai acompanhar disparos e automacoes programadas quando conectarmos agenda e filas reais.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" asChild>
                  <Link href="/minhas-solucoes">
                    <Settings2 className="mr-2 h-4 w-4" />
                    Configurar solucoes
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/solucoes">
                    <Rocket className="mr-2 h-4 w-4" />
                    Ver catalogo
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CalendarClock className="h-4 w-4 text-primary" />
                    Agenda de envios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">Nao conectada</p>
                  <p className="text-sm text-muted-foreground">
                    Ainda nao existe uma origem persistida para campanhas, rotinas ou mensagens programadas por usuario.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Send className="h-4 w-4 text-primary" />
                    Solucoes prontas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{loading ? "--" : solutions.length}</p>
                  <p className="text-sm text-muted-foreground">
                    Solucoes ativas que podem receber regras de disparo assim que a camada operacional for modelada.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Clock3 className="h-4 w-4 text-primary" />
                    Etapa seguinte
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">Filas + agenda</p>
                  <p className="text-sm text-muted-foreground">
                    O passo certo aqui e definir quando, para quem e com qual gatilho cada envio deve acontecer.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Base pronta para agendamentos</CardTitle>
                <CardDescription>
                  Ja deixamos a tela alinhada com o plano atual do usuario, mas sem inventar envios que o sistema ainda nao registra.
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
                    Seu plano atual ainda nao retornou solucoes ativas para usar como base de automacoes programadas.
                  </div>
                )}

                {!loading && !error && solutions.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Sem mock de agenda</Badge>
                      <Badge variant="outline">Pronto para regras reais</Badge>
                      <Badge variant="outline">Alinhado ao plano atual</Badge>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {highlightedSolutions.map((solution) => (
                        <div key={solution.id} className="rounded-lg border p-4">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <p className="font-medium">{solution.name}</p>
                            <Badge variant="secondary" className="capitalize">
                              {solution.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{solution.description}</p>
                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Apta a receber agenda futura</span>
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

            <Card>
              <CardHeader>
                <CardTitle>Quando esta area crescer</CardTitle>
                <CardDescription>
                  O caminho natural daqui e conectar esta tela com configuracoes reais das solucoes e com uma camada de execucao.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center gap-2 font-medium">
                    <CalendarRange className="h-4 w-4 text-primary" />
                    Regras de agenda
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Datas, horarios, recorrencia e janelas de envio por solucao.
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center gap-2 font-medium">
                    <Send className="h-4 w-4 text-primary" />
                    Filas e destinatarios
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Quem recebe, em qual canal, com qual segmentacao e em que volume.
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center gap-2 font-medium">
                    <Settings2 className="h-4 w-4 text-primary" />
                    Preferencias por solucao
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Parametros operacionais, limites e configuracoes avancadas ligados ao comportamento de envio.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
