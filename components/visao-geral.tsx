"use client"

import {
  Bot,
  Layers3,
  Clock,
  MessageSquare,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Plus,
  Edit,
  CalendarCheck,
  Calendar,
  Mail,
  ShieldCheck,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SolucaoCard } from "@/components/solucao-card"
import { MetricaCard } from "@/components/metrica-card"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useCurrentUser } from "@/hooks/use-current-user"

type MetricDirection = "up" | "down" | "neutral"

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
  is_recommended?: boolean | null
}

export function VisaoGeral() {
  const [solucoesAtivas, setSolucoesAtivas] = useState<SolucaoAtiva[]>([])
  const [planId, setPlanId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, loading: userLoading } = useCurrentUser()

  const iconMap: Record<string, LucideIcon> = {
    Bot,
    Calendar,
    Layers3,
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
            setPlanId(userData.plan_id ?? null)
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

  const categoriasAtivas = new Set(solucoesAtivas.map((solucao) => solucao.categoria)).size
  const hasSolutions = solucoesAtivas.length > 0

  const metricas: Array<{
    titulo: string
    valor: string
    icone: LucideIcon
    cor: string
    tendencia: string
    direcao: MetricDirection
  }> = [
    {
      titulo: "Automacoes Ativas",
      valor: solucoesAtivas.length.toString(),
      icone: Bot,
      cor: "bg-blue-500/10 text-blue-500",
      tendencia: hasSolutions ? "Disponiveis no seu plano atual" : "Nenhuma ativa no momento",
      direcao: hasSolutions ? "up" : "neutral",
    },
    {
      titulo: "Categorias Ativas",
      valor: categoriasAtivas.toString(),
      icone: Layers3,
      cor: "bg-green-500/10 text-green-500",
      tendencia: categoriasAtivas > 0 ? "Cobertura atual das solucoes carregadas" : "Sem categorias disponiveis",
      direcao: categoriasAtivas > 0 ? "up" : "neutral",
    },
    {
      titulo: "Plano Vinculado",
      valor: planId ? `#${planId}` : "Sem plano",
      icone: Clock,
      cor: "bg-purple-500/10 text-purple-500",
      tendencia: planId ? "Usado para filtrar disponibilidade" : "Liberado sem filtro de plano",
      direcao: "neutral",
    },
    {
      titulo: "Acesso do Usuario",
      valor: user ? "Ativo" : "Sem sessao",
      icone: ShieldCheck,
      cor: "bg-orange-500/10 text-orange-500",
      tendencia: user ? "Sessao valida para consultar APIs internas" : "Necessario autenticar novamente",
      direcao: user ? "up" : "down",
    },
  ]

  const sugestoesInteligentes = [
    {
      id: 1,
      titulo: "Revisar disponibilidade por plano",
      descricao: "Valide se as solucoes liberadas para este usuario batem com o plano vinculado na base.",
      icone: Sparkles,
      cor: "bg-yellow-500/10 text-yellow-500",
      link: "/minhas-solucoes",
    },
    {
      id: 2,
      titulo: "Preparar parametros das solucoes",
      descricao: "O proximo passo natural e ligar configuracoes reais de cada solucao ao comportamento do usuario.",
      icone: Edit,
      cor: "bg-blue-500/10 text-blue-500",
      link: "/configuracoes",
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
            <CardTitle>Estado das Interacoes</CardTitle>
            <CardDescription>Resumo honesto do que ja esta conectado e do que ainda falta modelar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-md bg-primary/10 p-2 text-primary">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium">A camada operacional ainda nao foi conectada</p>
                  <p className="text-sm text-muted-foreground">
                    Esta area ja nao mostra mais conversas ficticias. Quando modelarmos eventos, historico ou canais
                    reais, ela pode voltar a listar interacoes do usuario.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
              Hoje a dashboard ja respeita sessao, plano e solucoes ativas. O proximo passo aqui e adicionar uma fonte
              persistida para mensagens, atendimentos ou execucoes.
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/interacoes">Abrir central de interacoes</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Proximos Passos</CardTitle>
            <CardDescription>Sugestoes praticas para continuar conectando a operacao real do produto</CardDescription>
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
