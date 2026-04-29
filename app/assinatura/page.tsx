"use client"

import { useEffect, useMemo, useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Check, CreditCard, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useCurrentUser } from "@/hooks/use-current-user"
import type { Plan } from "@/lib/services/plans-service"
import { PLAN_MAPPING } from "@/lib/constants"

type BillingPlan = Plan & {
  recursos: string[]
}

type UserPlanRecord = {
  plan_id: number | null
}

export default function AssinaturaPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [plans, setPlans] = useState<BillingPlan[]>([])
  const [currentPlanId, setCurrentPlanId] = useState<number | null>(null)
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [loadingCurrentPlan, setLoadingCurrentPlan] = useState(true)
  const { user, loading: loadingUser } = useCurrentUser()

  useEffect(() => {
    const loadPlans = async () => {
      try {
        setLoadingPlans(true)
        const response = await fetch("/api/plans")
        if (!response.ok) {
          throw new Error(`Erro ao carregar planos: ${response.status}`)
        }

        const data = (await response.json()) as Plan[]
        const normalized = data.map((plan) => ({
          ...plan,
          recursos: Array.isArray(plan.features) ? plan.features.filter((item): item is string => typeof item === "string") : [],
        }))

        setPlans(normalized)
      } catch (error) {
        console.error("Erro ao carregar planos da assinatura:", error)
        setPlans([])
      } finally {
        setLoadingPlans(false)
      }
    }

    loadPlans()
  }, [])

  useEffect(() => {
    const loadCurrentPlan = async () => {
      if (!user?.id) {
        setCurrentPlanId(null)
        setLoadingCurrentPlan(false)
        return
      }

      try {
        setLoadingCurrentPlan(true)
        const userResponse = await fetch(`/api/users/${user.id}`)
        if (!userResponse.ok) {
          throw new Error(`Erro ao buscar usuário: ${userResponse.status}`)
        }

        const userData = (await userResponse.json()) as UserPlanRecord
        setCurrentPlanId(userData.plan_id ?? null)
      } catch (error) {
        console.error("Erro ao carregar plano atual do usuário:", error)
        setCurrentPlanId(null)
      } finally {
        setLoadingCurrentPlan(false)
      }
    }

    if (!loadingUser) {
      loadCurrentPlan()
    }
  }, [loadingUser, user?.id])

  const sortedPlans = useMemo(() => {
    return [...plans].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || (a.price ?? 0) - (b.price ?? 0))
  }, [plans])

  const currentPlan = sortedPlans.find((plan) => plan.id === currentPlanId) || null

  const currentPlanCode = currentPlan?.code
    ? PLAN_MAPPING[currentPlan.code.toLowerCase() as keyof typeof PLAN_MAPPING] || currentPlan.code.toLowerCase()
    : null

  const faturas = [
    {
      id: "INV-001",
      data: "Em breve",
      valor: currentPlan?.price ? `R$ ${currentPlan.price.toFixed(2)}` : "R$ 0,00",
      status: "Em breve",
    },
  ]

  const formatPrice = (price: number | null, billingCycle: string | null) => {
    if (price === null || price === 0) {
      return { preco: "R$ 0", periodo: "" }
    }

    return {
      preco: `R$ ${price.toFixed(2)}`,
      periodo: billingCycle === "anual" ? "/ano" : "/mês",
    }
  }

  const getDescription = (plan: BillingPlan) => {
    if (plan.description) return plan.description
    if (plan.max_solutions === null) return "Plano com acesso ampliado às soluções da plataforma."
    return `Plano com até ${plan.max_solutions} soluções ativas simultaneamente.`
  }

  const getResources = (plan: BillingPlan) => {
    const resources = [...plan.recursos]

    if (plan.max_solutions !== null) {
      resources.unshift(`Até ${plan.max_solutions} soluções ativas`)
    } else {
      resources.unshift("Soluções ativas ilimitadas")
    }

    return Array.from(new Set(resources))
  }

  const isLoading = loadingUser || loadingPlans || loadingCurrentPlan

  return (
    <div className="flex h-screen bg-background">
      <Sidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${sidebarCollapsed ? "md:ml-[70px]" : "md:ml-64"}`}
      >
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Minha Assinatura</h1>
              <p className="text-muted-foreground">Gerencie seu plano e veja seu histórico de pagamentos.</p>
            </div>

            <Tabs defaultValue="planos">
              <TabsList>
                <TabsTrigger value="planos">Planos</TabsTrigger>
                <TabsTrigger value="faturas">Faturas</TabsTrigger>
                <TabsTrigger value="metodos">Métodos de Pagamento</TabsTrigger>
              </TabsList>
              <TabsContent value="planos" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  {isLoading
                    ? Array.from({ length: 3 }).map((_, index) => (
                        <Card key={index} className="flex flex-col">
                          <CardHeader>
                            <Skeleton className="h-6 w-28" />
                            <Skeleton className="h-8 w-32" />
                            <Skeleton className="h-4 w-full" />
                          </CardHeader>
                          <CardContent className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-4/6" />
                          </CardContent>
                          <CardFooter>
                            <Skeleton className="h-10 w-full" />
                          </CardFooter>
                        </Card>
                      ))
                    : sortedPlans.map((plan) => {
                        const { preco, periodo } = formatPrice(plan.price, plan.billing_cycle)
                        const destaque = plan.id === currentPlanId
                        const recursos = getResources(plan)

                        return (
                          <Card key={plan.id} className={`flex flex-col ${destaque ? "border-primary shadow-md" : ""}`}>
                            {destaque && (
                              <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                                Plano Atual
                              </div>
                            )}
                            <CardHeader>
                              <CardTitle>{plan.name}</CardTitle>
                              <div className="flex items-baseline">
                                <span className="text-3xl font-bold">{preco}</span>
                                <span className="text-sm text-muted-foreground">{periodo}</span>
                              </div>
                              <CardDescription>{getDescription(plan)}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                              <ul className="space-y-2">
                                {recursos.map((recurso, index) => (
                                  <li key={index} className="flex items-center">
                                    <Check className="mr-2 h-4 w-4 text-primary" />
                                    <span>{recurso}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                            <CardFooter>
                              <Button className="w-full" variant={destaque ? "default" : "outline"} disabled>
                                {destaque ? "Plano Atual" : "Em breve"}
                              </Button>
                            </CardFooter>
                          </Card>
                        )
                      })}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Detalhes da Assinatura</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Plano Atual</p>
                        <p className="text-lg">{isLoading ? "Carregando..." : currentPlan?.name || "Não definido"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Próxima Cobrança</p>
                        <p className="text-lg">
                          {isLoading ? "Carregando..." : currentPlan?.price ? "A definir" : "Sem cobrança"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Valor</p>
                        <p className="text-lg">
                          {isLoading
                            ? "Carregando..."
                            : currentPlan
                              ? `${formatPrice(currentPlan.price, currentPlan.billing_cycle).preco}${formatPrice(currentPlan.price, currentPlan.billing_cycle).periodo}`
                              : "Não definido"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Status</p>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                          {currentPlanCode ? "Ativo" : "Pendente"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" disabled>
                      Cancelar Assinatura
                    </Button>
                    <Button disabled>Gerenciar Plano</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="faturas">
                <Card>
                  <CardHeader>
                    <CardTitle>Histórico de Faturas</CardTitle>
                    <CardDescription>Veja suas faturas anteriores e faça o download dos comprovantes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-4 bg-muted/50 p-3 text-sm font-medium">
                        <div>Fatura</div>
                        <div>Data</div>
                        <div>Valor</div>
                        <div>Status</div>
                      </div>
                      {faturas.map((fatura, index) => (
                        <div key={index} className="grid grid-cols-4 items-center border-t p-3 text-sm">
                          <div>{fatura.id}</div>
                          <div>{fatura.data}</div>
                          <div>{fatura.valor}</div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-muted text-muted-foreground">
                              {fatura.status}
                            </Badge>
                            <Button variant="ghost" size="icon" title="Download" disabled>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="metodos">
                <Card>
                  <CardHeader>
                    <CardTitle>Métodos de Pagamento</CardTitle>
                    <CardDescription>Gerencie seus cartões e formas de pagamento</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-md border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-md bg-muted p-2">
                            <CreditCard className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">Método de pagamento ainda não configurado</p>
                            <p className="text-sm text-muted-foreground">Integração financeira será ligada quando o fluxo de cobrança entrar.</p>
                          </div>
                        </div>
                        <Badge variant="outline">Pendente</Badge>
                      </div>
                    </div>
                    <Button className="flex items-center gap-2" disabled>
                      <CreditCard className="h-4 w-4" />
                      Adicionar Novo Método de Pagamento
                    </Button>
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
