"use client"

import { useState, useEffect } from "react"
import {
  MessageSquare,
  Calendar,
  BarChart,
  ThumbsUp,
  Clock,
  Users,
  Bot,
  Zap,
  Mail,
  PieChart,
  ChevronRight,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SolucaoCard } from "@/components/solucao-card"
import { MetricaCard } from "@/components/metrica-card"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useCurrentUser } from "@/hooks/use-current-user"

// Tipo para as soluções
interface Solucao {
  id: string | number
  slug: string | null
  name: string
  description: string | null
  category: string | null
  icon: string | null
  color: string | null
  is_active: boolean | null
  is_recommended: boolean | null
  is_premium: boolean | null
  premium_plan: string | null
}

type UserPlanRecord = {
  plan?: string | null
  plan_id?: number | null
}

// Mapeamento de ícones
const iconMap: Record<string, LucideIcon> = {
  Bot: Bot,
  Users: Users,
  Calendar: Calendar,
  ThumbsUp: ThumbsUp,
  Mail: Mail,
  PieChart: PieChart,
  Zap: Zap,
  Clock: Clock,
  MessageSquare: MessageSquare,
  BarChart: BarChart,
  // Adicione outros ícones conforme necessário
}

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("todos")
  const [solucoes, setSolucoes] = useState<Solucao[]>([])
  const [recomendados, setRecomendados] = useState<Solucao[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { user, loading: userLoading } = useCurrentUser()

  const categorias = [
    { id: "todos", label: "Todos" },
    { id: "atendimento", label: "Atendimento", icon: MessageSquare },
    { id: "vendas", label: "Vendas", icon: BarChart },
    { id: "agendamento", label: "Agendamento", icon: Calendar },
    { id: "feedback", label: "Feedback", icon: ThumbsUp },
  ]

  // Carregar soluções da API
  useEffect(() => {
    async function loadSolutions() {
      if (userLoading) return

      try {
        setLoading(true)

        // Primeiro, buscar o plano do usuário atual
        let planId: number | null = null

        if (user?.id) {
          const userResponse = await fetch(`/api/users/${user.id}`)
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
        }

        // Se tiver plano, buscar soluções disponíveis para o plano
        let url = "/api/solutions/active"
        if (planId) {
          url = `/api/solutions/active?planId=${planId}`
        }

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Erro ao buscar soluções: ${response.status}`)
        }

        const activeSolutions = await response.json()
        console.log("Soluções ativas carregadas:", activeSolutions)

        // Filtrar algumas soluções para recomendações
        // Aqui podemos implementar uma lógica mais sofisticada no futuro
        const recommendedSolutions = (activeSolutions as Solucao[])
          .filter((s) => s.is_recommended)
          .slice(0, 2) // Limitar a 2 recomendações

        setSolucoes(activeSolutions || [])
        setRecomendados(recommendedSolutions || [])
      } catch (error) {
        console.error("Erro ao carregar soluções:", error)
        toast({
          title: "Erro ao carregar soluções",
          description: "Não foi possível carregar as soluções. Tente novamente mais tarde.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadSolutions()
  }, [toast, user?.id, userLoading])

  // Converter solução do banco para o formato esperado pelo componente
  const convertSolution = (solution: Solucao) => {
    const IconComponent = solution.icon ? iconMap[solution.icon] || Bot : Bot

    return {
      id: solution.id.toString(),
      nome: solution.name,
      descricao: solution.description || "Sem descrição",
      categoria: solution.category || "geral",
      icone: IconComponent,
      cor: solution.color || "bg-blue-500/10 text-blue-500",
      status: solution.is_active ? "ativo" : "inativo",
      bloqueado: !!solution.is_premium,
      plano: solution.premium_plan || undefined,
    }
  }

  const solucoesFiltradas = solucoes
    .filter((solucao) => activeTab === "todos" || solucao.category?.toLowerCase() === activeTab)
    .map(convertSolution)

  const recomendadosConvertidos = recomendados.map((solution) => ({
    ...convertSolution(solution),
    status: "recomendado",
  }))

  const metricas = [
    {
      titulo: "Automações Ativas",
      valor: solucoes.filter((s) => s.is_active).length.toString(),
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

  // Renderizar esqueletos durante o carregamento
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Olá, bem-vindo(a) de volta!</h1>
          <p className="text-muted-foreground">Gerencie suas soluções inteligentes e acompanhe seu desempenho.</p>
        </div>

        <div className="space-y-4">
          <div className="flex overflow-auto pb-2">
            <Skeleton className="h-10 w-[100px] mr-2" />
            <Skeleton className="h-10 w-[120px] mr-2" />
            <Skeleton className="h-10 w-[110px] mr-2" />
            <Skeleton className="h-10 w-[130px] mr-2" />
            <Skeleton className="h-10 w-[100px] mr-2" />
            <Skeleton className="h-10 w-[130px] mr-2" />
            <Skeleton className="h-10 w-[100px]" />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-[120px] w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Olá, bem-vindo(a) de volta!</h1>
        <p className="text-muted-foreground">Gerencie suas soluções inteligentes e acompanhe seu desempenho.</p>
      </div>

      <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:w-auto">
          {categorias.map((categoria) => (
            <TabsTrigger key={categoria.id} value={categoria.id} className="flex items-center gap-2">
              {categoria.icon && <categoria.icon className="h-4 w-4" />}
              {categoria.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {solucoesFiltradas.length > 0 ? (
              solucoesFiltradas.map((solucao) => (
                <Link href={`/solucao/${solucao.id}`} key={solucao.id} className="block h-full">
                  <SolucaoCard solucao={solucao} />
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">Nenhuma solução encontrada nesta categoria.</p>
              </div>
            )}
          </div>
          {activeTab !== "todos" && solucoesFiltradas.length > 0 && (
            <Button variant="ghost" className="mt-4">
              Ver mais soluções de {categorias.find((c) => c.id === activeTab)?.label}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </TabsContent>
      </Tabs>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Recomendado para você</h2>
          <Button variant="link" className="text-primary">
            Ver todas as recomendações
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recomendadosConvertidos.length > 0 ? (
            recomendadosConvertidos.map((solucao) => (
              <Link href={`/solucao/${solucao.id}`} key={solucao.id} className="block h-full">
                <SolucaoCard solucao={solucao} />
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">Nenhuma recomendação disponível no momento.</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Métricas de Desempenho</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metricas.map((metrica, index) => (
            <MetricaCard key={index} metrica={metrica} />
          ))}
        </div>
      </div>
    </div>
  )
}
