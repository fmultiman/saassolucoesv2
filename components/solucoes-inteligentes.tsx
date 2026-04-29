"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import {
  AlertCircle,
  Bell,
  Bot,
  Briefcase,
  Calendar,
  CalendarCheck,
  CalendarPlus,
  ChevronRight,
  CheckSquare,
  FileText,
  Filter,
  Gift,
  Headphones,
  Heart,
  Instagram,
  Layers,
  Mail,
  Megaphone,
  MessageCircle,
  MessageSquare,
  PenTool,
  Phone,
  Plus,
  Repeat,
  Search,
  Send,
  Share2,
  ShoppingCart,
  Smile,
  Info,
  Play,
  Square,
  Star,
  ThumbsUp,
  UserCheck,
  Users,
  Zap,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Solution = {
  id: number
  name: string
  description: string | null
  category: string | null
  icon?: string | null
  activations?: number | null
  is_active: boolean | null
  is_recommended?: boolean | null
  custom_price?: number | null
  custom_limits?: unknown
}

type Categoria = {
  id: string
  label: string
  icon?: LucideIcon
  cor?: string
}

type PlanRecord = {
  id: number
  name: string
  code: string | null
  sort_order: number | null
}

type PlanSolutionRecord = {
  plan_id: number | null
  solution_id: number | null
}

type UserProfileResponse = {
  profile?: {
    preferences?: Record<string, unknown> | null
  } | null
}

type SolutionPreferenceMap = Record<string, { enabled?: boolean }>

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

const fallbackPlanOrder: Record<string, number> = {
  gratuito: 0,
  free: 0,
  essencial: 1,
  basic: 1,
  profissional: 2,
  pro: 2,
  completo: 3,
  enterprise: 3,
}

function normalizePlanCode(value?: string | null) {
  if (!value) return null
  return value.toLowerCase().trim()
}

function getCategoriaInfo(categoriaId?: string | null) {
  return categorias.find((cat) => cat.id === categoriaId?.toLowerCase()) || categorias[0]
}

function getPlanLabel(code?: string | null, plansByCode?: Map<string, PlanRecord>) {
  const normalizedCode = normalizePlanCode(code)
  if (!normalizedCode) return "plano superior"
  return plansByCode?.get(normalizedCode)?.name || normalizedCode.charAt(0).toUpperCase() + normalizedCode.slice(1)
}

export function SolucoesInteligentes() {
  const [activeTab, setActiveTab] = useState("todos")
  const [searchTerm, setSearchTerm] = useState("")
  const [visibleCategories, setVisibleCategories] = useState<Categoria[]>([])
  const [hiddenCategories, setHiddenCategories] = useState<Categoria[]>([])
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [userPlanId, setUserPlanId] = useState<number | null>(null)
  const [userPlanCode, setUserPlanCode] = useState<string | null>(null)
  const [plans, setPlans] = useState<PlanRecord[]>([])
  const [planSolutions, setPlanSolutions] = useState<PlanSolutionRecord[]>([])
  const [solutionPreferences, setSolutionPreferences] = useState<SolutionPreferenceMap>({})
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null)
  const [savingSolutionId, setSavingSolutionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const tabsListRef = useRef<HTMLDivElement | null>(null)
  const { user, loading: userLoading } = useCurrentUser()

  useEffect(() => {
    const fetchSolutions = async () => {
      if (userLoading) return

      try {
        setLoading(true)
        setError(null)

        const [solutionsResponse, plansResponse, planSolutionsResponse, userResponse, profileResponse] = await Promise.all([
          fetch("/api/solutions/active"),
          fetch("/api/plans"),
          fetch("/api/plan-solutions"),
          user?.id ? fetch(`/api/users/${user.id}`) : Promise.resolve(null),
          user?.id ? fetch("/api/user/profile") : Promise.resolve(null),
        ])

        if (!solutionsResponse.ok) {
          throw new Error(`Erro ao buscar soluções: ${solutionsResponse.status}`)
        }

        if (!plansResponse.ok) {
          throw new Error(`Erro ao buscar planos: ${plansResponse.status}`)
        }

        if (!planSolutionsResponse.ok) {
          throw new Error(`Erro ao buscar vínculos dos planos: ${planSolutionsResponse.status}`)
        }

        const [solutionsData, plansData, planSolutionsData] = await Promise.all([
          solutionsResponse.json(),
          plansResponse.json(),
          planSolutionsResponse.json(),
        ])

        setSolutions(solutionsData)
        setPlans(plansData)
        setPlanSolutions(planSolutionsData)

        if (userResponse && userResponse.ok) {
          const userData = await userResponse.json()
          setUserPlanId(userData.plan_id ?? null)
          setUserPlanCode(userData.plan ?? null)
        } else {
          setUserPlanId(null)
          setUserPlanCode(null)
        }

        if (profileResponse && profileResponse.ok) {
          const profileData = (await profileResponse.json()) as UserProfileResponse
          setSolutionPreferences((profileData.profile?.preferences?.solutionStates as SolutionPreferenceMap) || {})
        } else {
          setSolutionPreferences({})
        }
      } catch (err) {
        console.error("Erro ao carregar soluções:", err)
        setError(err instanceof Error ? err.message : "Erro desconhecido")
      } finally {
        setLoading(false)
      }
    }

    void fetchSolutions()
  }, [user?.id, userLoading])

  const plansById = useMemo(() => new Map(plans.map((plan) => [plan.id, plan])), [plans])
  const plansByCode = useMemo(
    () => new Map(plans.filter((plan) => plan.code).map((plan) => [normalizePlanCode(plan.code)!, plan])),
    [plans],
  )

  const effectiveUserPlanId = useMemo(() => {
    if (userPlanId) return userPlanId
    const normalizedCode = normalizePlanCode(userPlanCode)
    if (!normalizedCode) return null
    return plansByCode.get(normalizedCode)?.id ?? null
  }, [plansByCode, userPlanCode, userPlanId])

  const solutionPlanIds = useMemo(() => {
    const map = new Map<number, number[]>()
    for (const item of planSolutions) {
      if (!item.solution_id || !item.plan_id) continue
      const existing = map.get(item.solution_id) ?? []
      existing.push(item.plan_id)
      map.set(item.solution_id, existing)
    }
    return map
  }, [planSolutions])

  const minimumPlanBySolution = useMemo(() => {
    const map = new Map<number, PlanRecord | null>()

    for (const solution of solutions) {
      const associatedPlanIds = solutionPlanIds.get(solution.id) ?? []
      const associatedPlans = associatedPlanIds
        .map((planId) => plansById.get(planId))
        .filter((plan): plan is PlanRecord => Boolean(plan))
        .sort((a, b) => {
          const aOrder = a.sort_order ?? fallbackPlanOrder[normalizePlanCode(a.code) || ""] ?? 999
          const bOrder = b.sort_order ?? fallbackPlanOrder[normalizePlanCode(b.code) || ""] ?? 999
          return aOrder - bOrder
        })

      map.set(solution.id, associatedPlans[0] ?? null)
    }

    return map
  }, [plansById, solutionPlanIds, solutions])

  const accessBySolution = useMemo(() => {
    const accessibleIds = new Set<number>()
    if (!effectiveUserPlanId) return accessibleIds

    for (const item of planSolutions) {
      if (item.plan_id === effectiveUserPlanId && item.solution_id) {
        accessibleIds.add(item.solution_id)
      }
    }

    return accessibleIds
  }, [effectiveUserPlanId, planSolutions])

  const solutionStatus = useMemo(() => {
    const statusMap: Record<string, boolean> = {}
    for (const solution of solutions) {
      const storedState = solutionPreferences[String(solution.id)]?.enabled
      statusMap[String(solution.id)] = storedState ?? true
    }
    return statusMap
  }, [solutionPreferences, solutions])

  const recomendados = useMemo(
    () =>
      solutions
        .filter((solution) => solution.is_recommended)
        .slice(0, 3)
        .map((solution) => ({
          ...solution,
          motivo: "Baseado no seu segmento de mercado",
        })),
    [solutions],
  )

  const solucoesFiltradas = useMemo(
    () =>
      solutions.filter(
        (solution) =>
          (activeTab === "todos" || solution.category?.toLowerCase() === activeTab) &&
          (searchTerm === "" ||
            solution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            solution.description?.toLowerCase().includes(searchTerm.toLowerCase())),
      ),
    [activeTab, searchTerm, solutions],
  )

  const minhasSolucoes = useMemo(
    () => solucoesFiltradas.filter((solution) => accessBySolution.has(solution.id)),
    [accessBySolution, solucoesFiltradas],
  )

  const solucoesAdicionais = useMemo(
    () => solucoesFiltradas.filter((solution) => !accessBySolution.has(solution.id)),
    [accessBySolution, solucoesFiltradas],
  )

  const getSolutionIcon = (solution: Solution) => {
    if (solution.icon && iconMap[solution.icon]) {
      return iconMap[solution.icon]
    }

    const categoriaInfo = getCategoriaInfo(solution.category)
    return categoriaInfo.icon || MessageSquare
  }

  const calcularCategoriasVisiveis = () => {
    if (!tabsListRef.current) return

    const tabsListWidth = tabsListRef.current.offsetWidth
    const maxWidth = tabsListWidth * 0.8
    let totalWidth = 0
    const visible: Categoria[] = [categorias[0]]
    const hidden: Categoria[] = []

    for (let index = 1; index < categorias.length; index++) {
      const categoria = categorias[index]
      const categoriaWidth = categoria.label.length * 10 + 40

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

  useEffect(() => {
    calcularCategoriasVisiveis()

    const handleResize = () => {
      calcularCategoriasVisiveis()
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

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

  const renderSolutionsGrid = (items: Solution[], mode: "included" | "additional") => {
    if (items.length === 0) {
      return (
        <div className="col-span-3 flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-muted p-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium">
            {mode === "included" ? "Nenhuma solução disponível no seu plano" : "Nenhuma solução adicional encontrada"}
          </h3>
          <p className="mt-2 text-center text-muted-foreground">
            {mode === "included"
              ? "Ajuste a busca ou revise o plano vinculado a este usuário."
              : "Não encontramos outras soluções para esta categoria ou termo de busca."}
          </p>
        </div>
      )
    }

    return items.map((solution) => {
      const categoriaInfo = getCategoriaInfo(solution.category)
      const IconComponent = getSolutionIcon(solution)
      const minimumPlan = minimumPlanBySolution.get(solution.id)
      const minimumPlanLabel = minimumPlan?.name || getPlanLabel(minimumPlan?.code, plansByCode)

      return (
        <Link href={`/solucao/${solution.id}`} key={`${mode}-${solution.id}`} className="block h-full">
          <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
            <CardHeader className="flex-grow-0 pb-2">
              <div className="flex items-center justify-between">
                <div className={`rounded-md p-2 ${categoriaInfo.cor}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                {mode === "included" && solution.is_active && (
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                    Ativo
                  </Badge>
                )}
                {mode === "additional" && minimumPlan && (
                  <Badge variant="outline" className="border-amber-500/40 text-amber-600">
                    {minimumPlanLabel}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg">{solution.name}</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="min-h-[2.5rem] line-clamp-2 text-sm text-muted-foreground">
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
            <CardFooter className="flex flex-grow-0 gap-2 pt-2">
              {mode === "included" ? (
                solutionStatus[String(solution.id)] ? (
                  <>
                    <Button variant="outline" className="flex-1" onClick={(event) => {
                      event.preventDefault()
                      setSelectedSolution(solution)
                    }}>
                      Configurar
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={savingSolutionId === String(solution.id)}
                      onClick={(event) => {
                        event.preventDefault()
                        void saveSolutionState(String(solution.id), false)
                      }}
                    >
                      <Square className="h-4 w-4 text-red-500" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="flex-1"
                      onClick={(event) => {
                        event.preventDefault()
                        void saveSolutionState(String(solution.id), true)
                      }}
                    >
                      Ativar
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={savingSolutionId === String(solution.id)}
                      onClick={(event) => {
                        event.preventDefault()
                        void saveSolutionState(String(solution.id), true)
                      }}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </>
                )
              ) : (
                <>
                  <Button variant="outline" className="flex-1">
                    Disponível a partir do {minimumPlanLabel}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(event) => {
                      event.preventDefault()
                      setSelectedSolution(solution)
                    }}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        </Link>
      )
    })
  }

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
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <Skeleton key={index} className="h-64" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Soluções Inteligentes</h1>
          <p className="text-muted-foreground">Explore e ative soluções para otimizar seu negócio.</p>
        </div>

        <div className="rounded-md border border-red-200 bg-red-50 p-6 text-red-800">
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
            onChange={(event) => setSearchTerm(event.target.value)}
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
                    <Plus className="mr-1 h-4 w-4" />
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

        <TabsContent value={activeTab} className="mt-6 space-y-8">
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Minhas Soluções</h2>
              <p className="text-sm text-muted-foreground">
                Soluções disponíveis para o plano {getPlanLabel(userPlanCode, plansByCode)}.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{renderSolutionsGrid(minhasSolucoes, "included")}</div>
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Soluções Adicionais</h2>
              <p className="text-sm text-muted-foreground">
                Recursos que podem ser liberados em planos superiores ou combinações específicas.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {renderSolutionsGrid(solucoesAdicionais, "additional")}
            </div>
          </section>

          {activeTab !== "todos" && solucoesFiltradas.length > 0 && (
            <Button variant="ghost">
              Ver mais soluções de {categorias.find((categoria) => categoria.id === activeTab)?.label}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </TabsContent>
      </Tabs>

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
                  <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                    <CardHeader className="flex-grow-0 pb-2">
                      <div className="flex items-center justify-between">
                        <div className={`rounded-md p-2 ${categoriaInfo.cor}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <span className="rounded-full bg-yellow-500/20 px-2 py-1 text-xs font-medium text-yellow-500">
                          Recomendado
                        </span>
                      </div>
                      <CardTitle className="text-lg">{solution.name}</CardTitle>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="min-h-[2.5rem] line-clamp-2 text-sm text-muted-foreground">
                              {solution.description || "Sem descrição"}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-xs">
                            {solution.description || "Sem descrição"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <p className="mt-1 text-xs text-muted-foreground">
                        <span className="font-medium">Por que recomendamos:</span> {solution.motivo}
                      </p>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="h-16 rounded-md bg-accent/50 p-3">
                        <div className="text-xs text-muted-foreground">Prévia da solução</div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-grow-0 gap-2 pt-2">
                      <Button variant="outline" className="flex-1">
                        Disponível a partir do {getPlanLabel(minimumPlanBySolution.get(solution.id)?.code, plansByCode)}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(event) => {
                          event.preventDefault()
                          setSelectedSolution(solution)
                        }}
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      <Dialog open={!!selectedSolution} onOpenChange={(open) => !open && setSelectedSolution(null)}>
        <DialogContent className="sm:max-w-[560px]">
          {selectedSolution && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedSolution.name}</DialogTitle>
                <DialogDescription>Resumo rapido da solucao e das regras de acesso.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4 text-sm">
                <div className="rounded-md border p-4">
                  <p><strong>Categoria:</strong> {selectedSolution.category || "Sem categoria"}</p>
                  <p className="mt-2"><strong>Plano minimo:</strong> {getPlanLabel(minimumPlanBySolution.get(selectedSolution.id)?.code, plansByCode)}</p>
                  <p className="mt-2"><strong>Ativacoes:</strong> {selectedSolution.activations || 0}</p>
                </div>
                <div className="rounded-md border p-4 text-muted-foreground">
                  {selectedSolution.description || "Sem descricao"}
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
