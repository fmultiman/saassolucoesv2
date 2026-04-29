"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  BarChart,
  Bot,
  Calendar,
  Clock,
  Download,
  Edit,
  Filter,
  Mail,
  MessageSquare,
  Play,
  Search,
  Square,
  Plus,
  ThumbsUp,
  Users,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ApiSolution = {
  id: number | string
  name: string
  description: string | null
  category: string | null
  icon: string | null
  color: string | null
  is_active: boolean | null
  activations?: number | null
}

type UserPlanRecord = {
  plan?: string | null
  plan_id?: number | null
}

type UserProfileResponse = {
  profile?: {
    preferences?: Record<string, unknown> | null
  } | null
}

type SolutionPreferenceMap = Record<string, { enabled?: boolean }>

type ManagedSolution = {
  id: string
  nome: string
  descricao: string
  categoria: string
  icone: LucideIcon
  cor: string
  status: "ativo" | "inativo"
  interacoes: number
}

const iconMap: Record<string, LucideIcon> = {
  Bot,
  Users,
  BarChart,
  Clock,
  MessageSquare,
  Calendar,
  ThumbsUp,
  Mail,
}

export default function MinhasSolucoesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [solucoes, setSolucoes] = useState<ManagedSolution[]>([])
  const [solutionPreferences, setSolutionPreferences] = useState<SolutionPreferenceMap>({})
  const [selectedSolution, setSelectedSolution] = useState<ManagedSolution | null>(null)
  const [savingSolutionId, setSavingSolutionId] = useState<string | null>(null)
  const { user, loading: userLoading } = useCurrentUser()

  useEffect(() => {
    async function loadSolutions() {
      if (userLoading) return

      try {
        setLoading(true)
        setError(null)

        let planId: number | null = null
        let loadedPreferences: SolutionPreferenceMap = {}

        if (user?.id) {
          const [userResponse, profileResponse] = await Promise.all([
            fetch(`/api/users/${user.id}`),
            fetch("/api/user/profile"),
          ])

          if (userResponse.ok) {
            const userData = (await userResponse.json()) as UserPlanRecord
            planId = userData.plan_id ?? null

            if (!planId && userData.plan) {
              const planResponse = await fetch(`/api/plans/by-code/${encodeURIComponent(userData.plan)}`)
              if (planResponse.ok) {
                const planData = await planResponse.json()
                planId = planData.id ?? null
              }
            }
          }

          if (profileResponse.ok) {
            const profileData = (await profileResponse.json()) as UserProfileResponse
            loadedPreferences = (profileData.profile?.preferences?.solutionStates as SolutionPreferenceMap) || {}
          }
        }

        const url = planId ? `/api/solutions/active?planId=${planId}` : "/api/solutions/active"
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Erro ao buscar solucoes: ${response.status}`)
        }

        const data = (await response.json()) as ApiSolution[]
        const mappedSolutions = data.map((solution) => {
          const iconName = solution.icon || "Bot"
          const IconComponent = iconMap[iconName] || Bot

          return {
            id: solution.id.toString(),
            nome: solution.name,
            descricao: solution.description || "Sem descricao",
            categoria: solution.category || "geral",
            icone: IconComponent,
            cor: solution.color || "bg-blue-500/10 text-blue-500",
            status: solution.is_active ? "ativo" : "inativo",
            interacoes: solution.activations || 0,
          } satisfies ManagedSolution
        })

        setSolutionPreferences(loadedPreferences)
        setSolucoes(mappedSolutions)
      } catch (loadError) {
        console.error("Erro ao carregar minhas solucoes:", loadError)
        setError("Nao foi possivel carregar suas solucoes agora.")
        setSolucoes([])
      } finally {
        setLoading(false)
      }
    }

    void loadSolutions()
  }, [user?.id, userLoading])

  const saveSolutionState = async (solutionId: string, enabled: boolean) => {
    try {
      setSavingSolutionId(solutionId)

      const nextPreferences = {
        ...solutionPreferences,
        [solutionId]: {
          ...(solutionPreferences[solutionId] || {}),
          enabled,
        },
      }

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preferences: {
            solutionStates: nextPreferences,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Erro ao salvar preferencia: ${response.status}`)
      }

      setSolutionPreferences(nextPreferences)
    } catch (saveError) {
      console.error("Erro ao salvar estado da solucao:", saveError)
    } finally {
      setSavingSolutionId(null)
    }
  }

  const solutionStatus = useMemo(() => {
    const statusMap: Record<string, boolean> = {}
    for (const solution of solucoes) {
      const storedState = solutionPreferences[solution.id]?.enabled
      statusMap[solution.id] = storedState ?? true
    }
    return statusMap
  }, [solucoes, solutionPreferences])

  return (
    <div className="flex h-screen bg-background">
      <Sidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      <div
        className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ${sidebarCollapsed ? "md:ml-[70px]" : "md:ml-64"}`}
      >
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Minhas Solucoes</h1>
                <p className="text-muted-foreground">Gerencie e configure as solucoes disponiveis no seu plano.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
                <Button size="sm" asChild>
                  <Link href="/solucoes">
                    <Plus className="mr-2 h-4 w-4" />
                    Explorar Solucoes
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar solucoes..." className="pl-9" />
              </div>
              <Select defaultValue="todas">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as categorias</SelectItem>
                  <SelectItem value="atendimento">Atendimento</SelectItem>
                  <SelectItem value="vendas">Vendas</SelectItem>
                  <SelectItem value="agendamento">Agendamento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs defaultValue="ativas">
              <TabsList>
                <TabsTrigger value="ativas">Solucoes Ativas</TabsTrigger>
                <TabsTrigger value="historico">Historico</TabsTrigger>
              </TabsList>
              <TabsContent value="ativas" className="space-y-4">
                {loading &&
                  [1, 2, 3].map((item) => <div key={item} className="h-[260px] animate-pulse rounded-lg bg-muted" />)}
                {!loading &&
                  solucoes.map((solucao) => {
                    const isEnabled = solutionStatus[solucao.id]
                    return (
                      <Card key={solucao.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`rounded-md p-2 ${solucao.cor}`}>
                                <solucao.icone className="h-5 w-5" />
                              </div>
                              <div>
                                <CardTitle>{solucao.nome}</CardTitle>
                                <CardDescription>{solucao.descricao}</CardDescription>
                              </div>
                            </div>
                            <Badge variant={isEnabled ? "default" : "outline"} className={isEnabled ? "bg-green-500 hover:bg-green-600" : ""}>
                              {isEnabled ? "Em execucao" : "Pausada"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-6 md:grid-cols-3">
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Interacoes</p>
                              <p className="text-2xl font-bold">{solucao.interacoes}</p>
                              <p className="text-xs text-muted-foreground">Total acumulado da solucao</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Categoria</p>
                              <p className="text-2xl font-bold capitalize">{solucao.categoria}</p>
                              <p className="text-xs text-muted-foreground">Segmento principal atendido</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Operacao</p>
                              <p className="text-2xl font-bold">{isEnabled ? "Ligada" : "Pausada"}</p>
                              <p className="text-xs text-muted-foreground">Controle individual desta solucao na sua conta</p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`status-${solucao.id}`}>Execucao:</Label>
                            <Switch
                              id={`status-${solucao.id}`}
                              checked={isEnabled}
                              disabled={savingSolutionId === solucao.id}
                              onCheckedChange={(checked) => void saveSolutionState(solucao.id, checked)}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline">
                              <Download className="mr-2 h-4 w-4" />
                              Relatorio
                            </Button>
                            <Button variant="outline" onClick={() => setSelectedSolution(solucao)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Configurar
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    )
                  })}
                {!loading && !error && solucoes.length === 0 && (
                  <Card>
                    <CardContent className="py-10 text-center text-muted-foreground">
                      Nenhuma solucao ativa encontrada para o seu plano atual.
                    </CardContent>
                  </Card>
                )}
                {!loading && error && (
                  <Card>
                    <CardContent className="py-10 text-center text-destructive">{error}</CardContent>
                  </Card>
                )}
              </TabsContent>
              <TabsContent value="historico" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Historico de Solucoes</CardTitle>
                    <CardDescription>Essa area sera conectada quando modelarmos o historico real de ativacoes.</CardDescription>
                  </CardHeader>
                  <CardContent className="py-10 text-center text-muted-foreground">
                    Ainda nao ha uma fonte persistida para historico de ativacao e desativacao de solucoes.
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      <Dialog open={!!selectedSolution} onOpenChange={(open) => !open && setSelectedSolution(null)}>
        <DialogContent className="sm:max-w-[560px]">
          {selectedSolution && (
            <>
              <DialogHeader>
                <DialogTitle>Configurar solucao</DialogTitle>
                <DialogDescription>Resumo rapido e proximos passos para {selectedSolution.nome}.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4 text-sm">
                <div className="rounded-md border p-4">
                  <p><strong>Categoria:</strong> {selectedSolution.categoria}</p>
                  <p className="mt-2"><strong>Interacoes:</strong> {selectedSolution.interacoes}</p>
                  <p className="mt-2"><strong>Estado atual:</strong> {solutionStatus[selectedSolution.id] ? "Em execucao" : "Pausada"}</p>
                </div>
                <div className="rounded-md border p-4 text-muted-foreground">
                  {selectedSolution.descricao}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedSolution(null)}>
                  Fechar
                </Button>
                <Button asChild>
                  <Link href={`/solucao/${selectedSolution.id}`}>Abrir pagina da solucao</Link>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
