"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import {
  Bot,
  Users,
  Edit,
  BarChart,
  Plus,
  Filter,
  Search,
  Download,
  Clock,
  MessageSquare,
  Calendar,
  ThumbsUp,
  Mail,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useCurrentUser } from "@/hooks/use-current-user"
import Link from "next/link"

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

        setSolucoes(mappedSolutions)
      } catch (loadError) {
        console.error("Erro ao carregar minhas solucoes:", loadError)
        setError("Nao foi possivel carregar suas solucoes agora.")
        setSolucoes([])
      } finally {
        setLoading(false)
      }
    }

    loadSolutions()
  }, [user?.id, userLoading])

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
                  [1, 2, 3].map((item) => <div key={item} className="h-[260px] rounded-lg bg-muted animate-pulse" />)}
                {!loading &&
                  solucoes.map((solucao) => (
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
                          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                            Ativo
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
                            <p className="text-sm font-medium">Status</p>
                            <p className="text-2xl font-bold">Ativa</p>
                            <p className="text-xs text-muted-foreground">Disponivel no seu plano atual</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`status-${solucao.id}`}>Status:</Label>
                          <Switch id={`status-${solucao.id}`} checked disabled />
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Relatorio
                          </Button>
                          <Button asChild variant="outline">
                            <Link href={`/solucao/${solucao.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Configurar
                            </Link>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
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
    </div>
  )
}
