"use client"

import { useState, useRef, useEffect } from "react"
import {
  MessageSquare,
  Calendar,
  ThumbsUp,
  Users,
  Bot,
  Zap,
  Mail,
  ChevronRight,
  Heart,
  Megaphone,
  Share2,
  Briefcase,
  Plus,
  Search,
  Filter,
  ShoppingCart,
  UserCheck,
  Gift,
  FileText,
  CheckSquare,
  Bell,
  MessageCircle,
  Instagram,
  Phone,
  Headphones,
  Repeat,
  Star,
  Send,
  CalendarCheck,
  CalendarPlus,
  Smile,
  PenTool,
  Layers,
  AlertCircle,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { useCurrentUser } from "@/hooks/use-current-user"

// Tipo para as soluções
type Solution = {
  id: number
  name: string
  description: string | null
  category: string | null
  icon?: string | null
  activations?: number | null
  is_active: boolean
  custom_price?: number | null
  custom_limits?: Record<string, any> | null
}

type Categoria = {
  id: string
  label: string
  icon?: LucideIcon
  cor?: string
}

export function SolucoesInteligentes() {
  const [activeTab, setActiveTab] = useState("todos")
  const [searchTerm, setSearchTerm] = useState("")
  const [visibleCategories, setVisibleCategories] = useState<Categoria[]>([])
  const [hiddenCategories, setHiddenCategories] = useState<Categoria[]>([])
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const tabsListRef = useRef<HTMLDivElement | null>(null)
  const { user } = useCurrentUser()

  const categorias: Categoria[] = [
    { id: "todos", label: "Todos" },
    { id: "atendimento", label: "Atendimento", icon: MessageSquare, cor: "bg-blue-500/10 text-blue-500" },
    { id: "vendas", label: "Vendas", icon: ShoppingCart, cor: "bg-green-500/10 text-green-500" },
    { id: "relacionamento", label: "Relacionamento", icon: Heart, cor: "bg-pink-500/10 text-pink-500" },
    { id: "agendamento", label: "Agendamento", icon: Calendar, cor: "bg-purple-500/10 text-purple-500" },
    { id: "feedback", label: "Feedback", icon: ThumbsUp, cor: "bg-orange-500/10 text-orange-500" },
    { id: "marketing", label: "Marketing", icon: Megaphone, cor: "bg-red-500/10 text-red-500" },
    { id: "redes-sociais", label: "Redes Sociais", icon: Share2, cor: "bg-indigo-500/10 text-indigo-500" },
    { id: "administracao", label: "Administração", icon: Briefcase, cor: "bg-slate-500/10 text-slate-500" },
  ]

  // Mapeamento de ícones por categoria
  const iconMap: Record<string, LucideIcon> = {
    MessageSquare,
    Calendar,
    ThumbsUp,
    Users,
    Bot,
    Zap,
    Mail,
    Heart,
    Megaphone,
    Share2,
    Briefcase,
    ShoppingCart,
    UserCheck,
    Gift,
    FileText,
    CheckSquare,
    Bell,
    MessageCircle,
    Instagram,
    Phone,
    Headphones,
    Repeat,
    Star,
    Send,
    CalendarCheck,
    CalendarPlus,
    Smile,
    PenTool,
    Layers,
    AlertCircle,
  }

  // Carregar soluções do banco de dados
  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        setLoading(true)

        // Primeiro, buscar o plano do usuário atual
        let planId = null

        if (user?.id) {
          const userResponse = await fetch(`/api/users/${user.id}`)
          if (userResponse.ok) {
            const userData = await userResponse.json()
            planId = userData.plan_id
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

        const data = await response.json()
        console.log("Soluções carregadas:", data)
        setSolutions(data)
      } catch (err) {
        console.error("Erro ao carregar soluções:", err)
        setError(err instanceof Error ? err.message : "Erro desconhecido")
      } finally {
        setLoading(false)
      }
    }

    fetchSolutions()
  }, [user])

  // Recomendações personalizadas - poderia ser baseado em alguma lógica do backend no futuro
  const recomendados = solutions
    .filter((solution) => solution.is_active)
    .slice(0, 3)
    .map((solution) => ({
      ...solution,
      status: "recomendado",
      motivo: "Baseado no seu segmento de mercado",
    }))

  // Filtrar soluções com base na categoria ativa e termo de busca
  const solucoesFiltradas = solutions.filter(
    (solution) =>
      (activeTab === "todos" || solution.category?.toLowerCase() === activeTab) &&
      (searchTerm === "" ||
        solution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        solution.description?.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Encontrar a categoria correspondente para uma solução
  const getCategoriaInfo = (categoriaId?: string | null) => {
    return categorias.find((cat) => cat.id === categoriaId?.toLowerCase()) || categorias[0]
  }

  // Função para obter o ícone correto para uma solução
  const getSolutionIcon = (solution: Solution) => {
    // Tenta usar o ícone da solução se existir
    if (solution.icon && iconMap[solution.icon]) {
      return iconMap[solution.icon]
    }

    // Caso contrário, usa o ícone da categoria
    const categoriaInfo = getCategoriaInfo(solution.category)
    return categoriaInfo.icon || MessageSquare
  }

  // Função para calcular quais categorias devem ser visíveis e quais devem ir para o dropdown
  const calcularCategoriasVisiveis = () => {
    if (!tabsListRef.current) return

    const tabsList = tabsListRef.current
    const tabsListWidth = tabsList.offsetWidth
    const maxWidth = tabsListWidth * 0.8 // 80% da largura disponível

    let totalWidth = 0
    const visible: Categoria[] = []
    const hidden: Categoria[] = []

    // Adicionar o botão "Todos" primeiro
    const todosCategoria = categorias[0]
    visible.push(todosCategoria)

    // Calcular quais categorias cabem na largura disponível
    for (let i = 1; i < categorias.length; i++) {
      const categoria = categorias[i]
      // Estimativa de largura para cada categoria (ajuste conforme necessário)
      const categoriaWidth = categoria.label.length * 10 + 40 // Estimativa baseada no texto + ícone

      if (totalWidth + categoriaWidth < maxWidth) {
        visible.push(categoria)
        totalWidth += categoriaWidth
      } else {
        hidden.push(categoria)
      }
    }

    setVisibleCategories(visible)
    setHiddenCategories(hidden)
  }

  // Recalcular categorias visíveis quando a janela for redimensionada
  useEffect(() => {
    calcularCategoriasVisiveis()

    const handleResize = () => {
      calcularCategoriasVisiveis()
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Verificar disponibilidade de uma solução para o usuário atual
  const checkSolutionAvailability = async (solutionId: number) => {
    try {
      const response = await fetch(`/api/solutions/${solutionId}/availability`)
      if (!response.ok) {
        throw new Error(`Erro ao verificar disponibilidade: ${response.status}`)
      }

      const data = await response.json()
      return data.available
    } catch (error) {
      console.error("Erro ao verificar disponibilidade:", error)
      return false
    }
  }

  // Renderizar esqueleto de carregamento
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Soluções Inteligentes</h1>
          <p className="text-muted-foreground">Explore e ative soluções para otimizar seu negócio.</p>
        </div>

        <div className="flex items-center gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
        </div>

        <div className="flex items-center">
          <Skeleton className="h-10 w-full max-w-md" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    )
  }

  // Renderizar mensagem de erro
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Soluções Inteligentes</h1>
          <p className="text-muted-foreground">Explore e ative soluções para otimizar seu negócio.</p>
        </div>

        <div className="p-6 bg-red-50 border border-red-200 rounded-md text-red-800">
          <h3 className="text-lg font-medium">Erro ao carregar soluções</h3>
          <p className="mt-2">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Soluções Inteligentes</h1>
        <p className="text-muted-foreground">Explore e ative soluções para otimizar seu negócio.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar soluções..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" title="Filtros adicionais">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center" ref={tabsListRef}>
          <TabsList className="h-auto p-1">
            {visibleCategories.map((categoria) => (
              <TabsTrigger key={categoria.id} value={categoria.id} className="flex items-center gap-2 px-3 py-2">
                {categoria.icon && <categoria.icon className="h-4 w-4" />}
                {categoria.label}
              </TabsTrigger>
            ))}

            {hiddenCategories.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 px-3">
                    <Plus className="h-4 w-4 mr-1" />
                    Mais
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {hiddenCategories.map((categoria) => (
                    <DropdownMenuItem
                      key={categoria.id}
                      onClick={() => setActiveTab(categoria.id)}
                      className="flex items-center gap-2"
                    >
                      {categoria.icon && <categoria.icon className="h-4 w-4" />}
                      {categoria.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {solucoesFiltradas.length > 0 ? (
              solucoesFiltradas.map((solution) => {
                const categoriaInfo = getCategoriaInfo(solution.category)
                const IconComponent = getSolutionIcon(solution)
                return (
                  <Link href={`/solucao/${solution.id}`} key={solution.id} className="block h-full">
                    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.02] h-full flex flex-col">
                      <CardHeader className="pb-2 flex-grow-0">
                        <div className="flex items-center justify-between">
                          <div className={`rounded-md p-2 ${categoriaInfo.cor}`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          {solution.is_active && (
                            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                              Ativo
                            </Badge>
                          )}
                          {solution.custom_price && (
                            <Badge variant="outline" className="border-muted-foreground">
                              Personalizado
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">{solution.name}</CardTitle>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                                {solution.description || "Sem descrição"}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-xs">
                              {solution.description || "Sem descrição"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant="outline" className={categoriaInfo.cor}>
                            {categoriaInfo.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{solution.activations || 0} ativações</span>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="h-16 rounded-md bg-accent/50 p-3">
                          <div className="text-xs text-muted-foreground">Prévia da solução</div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2 pt-2 flex-grow-0">
                        <>
                          {solution.is_active ? (
                            <>
                              <Button variant="outline" className="flex-1">
                                Configurar
                              </Button>
                              <Button variant="destructive" size="icon">
                                <div className="h-4 w-4 rounded-full bg-current" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button className="flex-1">Ativar</Button>
                              <Button variant="outline">Testar</Button>
                            </>
                          )}
                        </>
                      </CardFooter>
                    </Card>
                  </Link>
                )
              })
            ) : (
              <div className="col-span-3 flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-4">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium">Nenhuma solução encontrada</h3>
                <p className="mt-2 text-center text-muted-foreground">
                  Não encontramos soluções para esta categoria ou termo de busca. Deseja solicitar uma nova solução?
                </p>
                <Button className="mt-4">Solicitar Nova Solução</Button>
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

      {/* Seção Recomendado para Você */}
      {recomendados.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Recomendado para você</h2>
            <Button variant="link" className="text-primary">
              Ver todas as recomendações
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recomendados.map((solution) => {
              const categoriaInfo = getCategoriaInfo(solution.category)
              const IconComponent = getSolutionIcon(solution)
              return (
                <Link href={`/solucao/${solution.id}`} key={`rec-${solution.id}`} className="block h-full">
                  <Card className="group overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.02] h-full flex flex-col">
                    <CardHeader className="pb-2 flex-grow-0">
                      <div className="flex items-center justify-between">
                        <div className={`rounded-md p-2 ${categoriaInfo.cor}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-500 font-medium">
                          Recomendado
                        </span>
                      </div>
                      <CardTitle className="text-lg">{solution.name}</CardTitle>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                              {solution.description || "Sem descrição"}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-xs">
                            {solution.description || "Sem descrição"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <p className="text-xs text-muted-foreground mt-1">
                        <span className="font-medium">Por que recomendamos:</span> {solution.motivo}
                      </p>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="h-16 rounded-md bg-accent/50 p-3">
                        <div className="text-xs text-muted-foreground">Prévia da solução</div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2 pt-2 flex-grow-0">
                      <Button className="flex-1">Ativar</Button>
                      <Button variant="outline">Testar</Button>
                    </CardFooter>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
