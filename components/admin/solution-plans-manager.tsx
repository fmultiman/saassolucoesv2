"use client"

import { useEffect, useState } from "react"
import { Check, ChevronsUpDown, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

type Plan = {
  id: number
  name: string
  description: string | null
  price: number
}

type PlanSolution = {
  id: number
  plan_id: number
  solution_id: number
  custom_price: number | null
  custom_limits: Record<string, any> | null
}

type SolutionPlansManagerProps = {
  solutionId: number
  solutionName: string
}

export function SolutionPlansManager({ solutionId, solutionName }: SolutionPlansManagerProps) {
  const [plans, setPlans] = useState<Plan[]>([])
  const [selectedPlans, setSelectedPlans] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const [plansResponse, planSolutionsResponse] = await Promise.all([
          fetch("/api/plans"),
          fetch(`/api/plan-solutions?solutionId=${solutionId}`),
        ])

        if (!plansResponse.ok) throw new Error(`Erro ao buscar planos: ${plansResponse.status}`)
        if (!planSolutionsResponse.ok) throw new Error(`Erro ao buscar associações: ${planSolutionsResponse.status}`)

        const [plansData, planSolutionsData] = await Promise.all([plansResponse.json(), planSolutionsResponse.json()])

        setPlans(plansData)
        setSelectedPlans(planSolutionsData.map((ps: PlanSolution) => ps.plan_id))
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados. Tente novamente mais tarde.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (solutionId) {
      void fetchData()
    }
  }, [solutionId, toast])

  const filteredPlans = plans.filter((plan) => plan.name.toLowerCase().includes(searchTerm.toLowerCase()))
  const availablePlans = filteredPlans.filter((plan) => !selectedPlans.includes(plan.id))

  const addPlanToSolution = async (planId: number) => {
    try {
      setSaving(true)

      const response = await fetch("/api/plan-solutions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan_id: planId,
          solution_id: solutionId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Erro ao adicionar plano: ${response.status}`)
      }

      setSelectedPlans((current) => [...current, planId])
      setOpen(false)
      setSearchTerm("")

      toast({
        title: "Sucesso",
        description: "Plano associado à solução com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao adicionar plano à solução:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível associar o plano à solução.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const removePlanFromSolution = async (planId: number) => {
    try {
      setSaving(true)

      const planSolutionsResponse = await fetch(`/api/plan-solutions?planId=${planId}&solutionId=${solutionId}`)
      if (!planSolutionsResponse.ok) {
        throw new Error(`Erro ao buscar associação: ${planSolutionsResponse.status}`)
      }

      const planSolutionsData = await planSolutionsResponse.json()
      if (!planSolutionsData || planSolutionsData.length === 0) {
        throw new Error("Associação não encontrada")
      }

      const associationId = planSolutionsData[0].id
      const response = await fetch(`/api/plan-solutions/${associationId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Erro ao remover plano: ${response.status}`)
      }

      setSelectedPlans((current) => current.filter((id) => id !== planId))

      toast({
        title: "Sucesso",
        description: "Plano removido da solução com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao remover plano da solução:", error)
      toast({
        title: "Erro",
        description: "Não foi possível remover o plano da solução.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="mb-2 h-8 w-64" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Planos com a Solução {solutionName}</CardTitle>
        <CardDescription>
          Gerencie quais planos incluem esta solução. Os clientes com estes planos terão acesso a esta solução.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between md:w-[320px]"
                  disabled={saving}
                >
                  <span>Adicionar plano...</span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 md:w-[340px]">
                <div className="space-y-2 p-3">
                  <Input
                    placeholder="Buscar plano..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                  <div className="max-h-[260px] overflow-y-auto">
                    {availablePlans.length === 0 ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">Nenhum plano encontrado.</div>
                    ) : (
                      <div className="space-y-1">
                        {availablePlans.map((plan) => (
                          <button
                            key={plan.id}
                            type="button"
                            className="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                            onClick={() => void addPlanToSolution(plan.id)}
                            disabled={saving}
                          >
                            <div className="min-w-0">
                              <div className="font-medium">{plan.name}</div>
                              <div className="truncate text-xs text-muted-foreground">
                                {plan.description || "Sem descrição"}
                              </div>
                            </div>
                            <Check className="ml-3 h-4 w-4 shrink-0 opacity-60" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            {selectedPlans.length > 0 ? (
              plans
                .filter((plan) => selectedPlans.includes(plan.id))
                .map((plan) => (
                  <div key={plan.id} className="flex items-center justify-between rounded-md border p-3 hover:bg-accent/50">
                    <div className="flex items-center gap-2">
                      <Checkbox checked disabled />
                      <div>
                        <p className="font-medium">{plan.name}</p>
                        <p className="line-clamp-1 text-sm text-muted-foreground">{plan.description || "Sem descrição"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">R$ {plan.price.toFixed(2)}</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => void removePlanFromSolution(plan.id)}
                        disabled={saving}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-muted p-3">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-3 text-lg font-medium">Nenhum plano associado</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Esta solução não está associada a nenhum plano. Adicione planos para que os clientes possam acessar
                  esta solução.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          {selectedPlans.length} {selectedPlans.length === 1 ? "plano" : "planos"} com esta solução
        </p>
      </CardFooter>
    </Card>
  )
}
