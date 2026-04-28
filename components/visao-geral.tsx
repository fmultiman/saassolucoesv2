"use client"

import {
  Bot,
  Users,
  ThumbsUp,
  Clock,
  MessageSquare,
  ChevronRight,
  Sparkles,
  Lightbulb,
  ArrowRight,
  Plus,
  Edit,
  CalendarCheck,
  Calendar,
  Mail,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SolucaoCard } from "@/components/solucao-card"
import { MetricaCard } from "@/components/metrica-card"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useCurrentUser } from "@/hooks/use-current-user"

type SolucaoAtiva = {
  id: string
  nome: string
  descricao: string
  categoria: string
  icone: LucideIcon
  cor: string
  status: string
  bloqueado: boolean
}

type ApiSolution = {
  id: string | number
  name: string
  description: string | null
  category: string | null
  icon: string | null
  color: string | null
  is_active: boolean | null
}

export function VisaoGeral() {
  const [solucoesAtivas, setSolucoesAtivas] = useState<SolucaoAtiva[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, loading: userLoading } = useCurrentUser()

  const iconMap: Record<string, LucideIcon> = {
    Bot,
    Users,
    Calendar,
    ThumbsUp,
    Mail,
    MessageSquare,
    Clock,
  }

  useEffect(() => {
    async function loadActiveSolutions() {
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

        const url = planId ? `/api/solutions/active?planId=${planId}&limit=3` : "/api/solutions/active?limit=3"
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Erro ao buscar solucoes: ${response.status}`)
        }

        const data = (await response.json()) as ApiSolution[]
        const formattedSolutions = data.map((solution) => {
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
            bloqueado: false,
          }
        })

        setSolucoesAtivas(formattedSolutions)
      } catch (loadError) {
        console.error("Erro ao carregar solucoes:", loadError)
        setError("Nao foi possivel carregar as solucoes no momento.")
        setSolucoesAtivas([])
      } finally {
        setLoading(false)
      }
    }

    loadActiveSolutions()
  }, [user?.id, userLoading])

  const metricas = [
    {
      titulo: "Automacoes Ativas",
      valor: solucoesAtivas.length.toString(),
      icone: Bot,
      cor: "bg-blue-500/10 text-blue-500",
      tendencia: "+1 este mes",
      positivo: true,
    },
    {
      titulo: "Mensagens Enviadas",
      valor: "1.248",
      icone: MessageSquare,
      cor: "bg-green-500/10 text-green-500",
      tendencia: "+22% vs. mes anterior",
      positivo: true,
    },
    {
      titulo: "Tempo Economizado",
      valor: "18h",
      icone: Clock,
      cor: "bg-purple-500/10 text-purple-500",
      tendencia: "~3h por dia",
      positivo: true,
    },
    {
      titulo: "Taxa de Engajamento",
      valor: "68%",
      icone: ThumbsUp,
      cor: "bg-orange-500/10 text-orange-500",
      tendencia: "+5% vs. mes anterior",
      positivo: true,
    },
  ]

  const ultimasInteracoes = [
    {
      id: 1,
      cliente: "Maria Silva",
      mensagem: "Gostaria de saber mais sobre o plano premium",
      horario: "Hoje, 14:35",
      avatar: "/placeholder.svg",
    },
    {
      id: 2,
      cliente: "Joao Oliveira",
      mensagem: "Preciso remarcar minha consulta para amanha",
      horario: "Hoje, 11:20",
      avatar: "/placeholder.svg",
    },
    {
      id: 3,
      cliente: "Ana Costa",
      mensagem: "Obrigada pelo excelente atendimento!",
      horario: "Ontem, 16:45",
      avatar: "/placeholder.svg",
    },
  ]

  const sugestoesInteligentes = [
    {
      id: 1,
      titulo: "Aumente suas vendas",
      descricao: "Ative a solucao de Email Marketing para aumentar suas conversoes em ate 25%",
      icone: Sparkles,
      cor: "bg-yellow-500/10 text-yellow-500",
      link: "/solucao/email-marketing",
    },
    {
      id: 2,
      titulo: "Melhore o atendimento",
      descricao: "Configure respostas automaticas para as perguntas mais frequentes",
      icone: Lightbulb,
      cor: "bg-blue-500/10 text-blue-500",
      link: "/solucao/chat-rapido",
    },
  ]

  const atalhosRapidos = [
    {
      id: 1,
      titulo: "Ativar nova solucao",
      descricao: "Explore o catalogo de solucoes",
      icone: Plus,
      cor: "bg-purple-500/10 text-purple-500",
      href: "/solucoes",
    },
    {
      id: 2,
      titulo: "Editar minhas solucoes",
      descricao: "Configure solucoes ativas",
      icone: Edit,
      cor: "bg-green-500/10 text-green-500",
      href: "/minhas-solucoes",
    },
    {
      id: 3,
      titulo: "Ver proximos envios",
      descricao: "Automacoes programadas",
      icone: CalendarCheck,
      cor: "bg-blue-500/10 text-blue-500",
      href: "/proximos-envios",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ola, bem-vindo(a) de volta!</h1>
        <p className="text-muted-foreground">Confira o resumo das suas atividades e solucoes.</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Solucoes Ativas</h2>
          <Button variant="link" className="text-primary" asChild>
            <Link href="/solucoes">
              Ver todas <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading &&
            [1, 2, 3].map((item) => <div key={item} className="h-[200px] rounded-lg bg-muted animate-pulse" />)}
          {!loading &&
            solucoesAtivas.map((solucao) => (
              <Link href={`/solucao/${solucao.id}`} key={solucao.id} className="block h-full">
                <SolucaoCard solucao={solucao} />
              </Link>
            ))}
          {!loading && !error && solucoesAtivas.length === 0 && (
            <div className="col-span-full rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              Nenhuma solucao ativa encontrada para o seu plano atual.
            </div>
          )}
          {!loading && error && (
            <div className="col-span-full rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center text-sm text-destructive">
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Ultimas Interacoes</CardTitle>
            <CardDescription>Interacoes recentes com seus clientes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {ultimasInteracoes.map((interacao) => (
              <div key={interacao.id} className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-accent/50 overflow-hidden">
                  <img
                    src={interacao.avatar || "/placeholder.svg"}
                    alt={interacao.cliente}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{interacao.cliente}</p>
                    <span className="text-xs text-muted-foreground">{interacao.horario}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{interacao.mensagem}</p>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/interacoes">Ver todas as interacoes</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Sugestoes Inteligentes</CardTitle>
            <CardDescription>Recomendacoes baseadas no seu perfil</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sugestoesInteligentes.map((sugestao) => (
              <Link href={sugestao.link} key={sugestao.id}>
                <div className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50">
                  <div className={`rounded-md p-2 ${sugestao.cor}`}>
                    <sugestao.icone className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">{sugestao.titulo}</p>
                    <p className="text-sm text-muted-foreground">{sugestao.descricao}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="ml-auto">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Link>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full">
              Ver mais sugestoes
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Metricas de Uso</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metricas.map((metrica, index) => (
            <MetricaCard key={index} metrica={metrica} />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Atalhos Rapidos</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {atalhosRapidos.map((atalho) => (
            <Link href={atalho.href} key={atalho.id}>
              <Button
                variant="outline"
                className="h-auto w-full flex-col items-center justify-center gap-2 p-4 hover:bg-accent/50 text-left"
              >
                <div className="flex w-full items-center gap-3">
                  <div className={`rounded-md p-2 ${atalho.cor}`}>
                    <atalho.icone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{atalho.titulo}</div>
                    <div className="text-xs text-muted-foreground">{atalho.descricao}</div>
                  </div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
