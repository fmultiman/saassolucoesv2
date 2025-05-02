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
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SolucaoCard } from "@/components/solucao-card"
import { MetricaCard } from "@/components/metrica-card"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useCurrentUser } from "@/hooks/use-current-user"

export function VisaoGeral() {
  const [solucoesAtivas, setSolucoesAtivas] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useCurrentUser()

  // Mapeamento de ícones
  const iconMap: Record<string, any> = {
    Bot: Bot,
    Users: Users,
    Calendar: Calendar,
    ThumbsUp: ThumbsUp,
    Mail: Mail,
    MessageSquare: MessageSquare,
    Clock: Clock,
    // Adicione outros ícones conforme necessário
  }

  useEffect(() => {
    async function loadActiveSolutions() {
      try {
        setLoading(true)

        // Buscar o plano do usuário atual
        let planId = null
        if (user?.id) {
          const userResponse = await fetch(`/api/users/${user.id}`)
          if (userResponse.ok) {
            const userData = await userResponse.json()
            planId = userData.plan_id
          }
        }

        // Buscar soluções ativas para o plano do usuário
        const url = planId ? `/api/solutions/active?planId=${planId}&limit=3` : "/api/solutions/active?limit=3"

        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`Erro ao buscar soluções: ${response.status}`)
        }

        const data = await response.json()

        // Converter para o formato esperado pelo componente
        const formattedSolutions = data.map((solution) => {
          const iconName = solution.icon || "Bot"
          const IconComponent = iconMap[iconName] || Bot

          return {
            id: solution.id.toString(),
            nome: solution.name,
            descricao: solution.description || "Sem descrição",
            categoria: solution.category || "geral",
            icone: IconComponent,
            cor: solution.color || "bg-blue-500/10 text-blue-500",
            status: solution.is_active ? "ativo" : "inativo",
            bloqueado: false,
          }
        })

        setSolucoesAtivas(formattedSolutions)
      } catch (error) {
        console.error("Erro ao carregar soluções:", error)
        // Fallback para soluções estáticas em caso de erro
        setSolucoesAtivas([
          {
            id: "autoatendimento-ia",
            nome: "Autoatendimento com IA",
            descricao: "Cliente interage com um fluxo que entende a intenção e responde sozinho.",
            categoria: "atendimento",
            icone: Bot,
            cor: "bg-blue-500/10 text-blue-500",
            status: "ativo",
            bloqueado: false,
          },
          {
            id: "recuperar-cliente",
            nome: "Recuperar Cliente Inativo",
            descricao: "Reativa contatos que pararam de responder com mensagem personalizada.",
            categoria: "vendas",
            icone: Users,
            cor: "bg-green-500/10 text-green-500",
            status: "ativo",
            bloqueado: false,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    loadActiveSolutions()
  }, [user])

  // Métricas de uso
  const metricas = [
    {
      titulo: "Automações Ativas",
      valor: "2",
      icone: Bot,
      cor: "bg-blue-500/10 text-blue-500",
      tendencia: "+1 este mês",
      positivo: true,
    },
    {
      titulo: "Mensagens Enviadas",
      valor: "1.248",
      icone: MessageSquare,
      cor: "bg-green-500/10 text-green-500",
      tendencia: "+22% vs. mês anterior",
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
      tendencia: "+5% vs. mês anterior",
      positivo: true,
    },
  ]

  // Últimas interações
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
      cliente: "João Oliveira",
      mensagem: "Preciso remarcar minha consulta para amanhã",
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

  // Sugestões inteligentes
  const sugestoesInteligentes = [
    {
      id: 1,
      titulo: "Aumente suas vendas",
      descricao: "Ative a solução de Email Marketing para aumentar suas conversões em até 25%",
      icone: Sparkles,
      cor: "bg-yellow-500/10 text-yellow-500",
      link: "/solucao/email-marketing",
    },
    {
      id: 2,
      titulo: "Melhore o atendimento",
      descricao: "Configure respostas automáticas para as perguntas mais frequentes",
      icone: Lightbulb,
      cor: "bg-blue-500/10 text-blue-500",
      link: "/solucao/chat-rapido",
    },
  ]

  // Atalhos rápidos atualizados
  const atalhosRapidos = [
    {
      id: 1,
      titulo: "Ativar nova solução",
      descricao: "Explore o catálogo de soluções",
      icone: Plus,
      cor: "bg-purple-500/10 text-purple-500",
      href: "/solucoes",
    },
    {
      id: 2,
      titulo: "Editar minhas soluções",
      descricao: "Configure soluções ativas",
      icone: Edit,
      cor: "bg-green-500/10 text-green-500",
      href: "/minhas-solucoes",
    },
    {
      id: 3,
      titulo: "Ver próximos envios",
      descricao: "Automações programadas",
      icone: CalendarCheck,
      cor: "bg-blue-500/10 text-blue-500",
      href: "/proximos-envios",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Olá, bem-vindo(a) de volta!</h1>
        <p className="text-muted-foreground">Confira o resumo das suas atividades e soluções.</p>
      </div>

      {/* Soluções Ativas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Soluções Ativas</h2>
          <Button variant="link" className="text-primary" asChild>
            <Link href="/solucoes">
              Ver todas <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {solucoesAtivas.map((solucao) => (
            <Link href={`/solucao/${solucao.id}`} key={solucao.id} className="block h-full">
              <SolucaoCard solucao={solucao} />
            </Link>
          ))}
        </div>
      </div>

      {/* Últimas Interações e Sugestões Inteligentes em duas colunas */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Últimas Interações */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Últimas Interações</CardTitle>
            <CardDescription>Interações recentes com seus clientes</CardDescription>
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
              <Link href="/interacoes">Ver todas as interações</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Sugestões Inteligentes */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Sugestões Inteligentes</CardTitle>
            <CardDescription>Recomendações baseadas no seu perfil</CardDescription>
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
              Ver mais sugestões
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Métricas de Uso */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Métricas de Uso</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metricas.map((metrica, index) => (
            <MetricaCard key={index} metrica={metrica} />
          ))}
        </div>
      </div>

      {/* Atalhos Rápidos */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Atalhos Rápidos</h2>
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
