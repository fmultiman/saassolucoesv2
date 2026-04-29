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

type Solution = {
  id: number
  name: string
  description: string | null
  category: string | null
  is_active: boolean
}

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

type PlanSolutionsManagerProps = {
  planId: number
  onClose?: () => void
}

export function PlanSolutionsManager({ planId }: PlanSolutionsManagerProps) {
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [selectedSolutions, setSelectedSolutions] = useState<number[]>([])
  const [plan, setPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const [planResponse, solutionsResponse, planSolutionsResponse] = await Promise.all([
          fetch(`/api/plans/${planId}`),
          fetch("/api/solutions"),
          fetch(`/api/plan-solutions?planId=${planId}`),
        ])

        if (!planResponse.ok) throw new Error(`Erro ao buscar plano: ${planResponse.status}`)
        if (!solutionsResponse.ok) throw new Error(`Erro ao buscar soluções: ${solutionsResponse.status}`)
        if (!planSolutionsResponse.ok) throw new Error(`Erro ao buscar associações: ${planSolutionsResponse.status}`)

        const [planData, solutionsData, planSolutionsData] = await Promise.all([
          planResponse.json(),
          solutionsResponse.json(),
          planSolutionsResponse.json(),
        ])

        setPlan(planData)
        setSolutions(solutionsData)
        setSelectedSolutions(planSolutionsData.map((ps: PlanSolution) => ps.solution_id))
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

    if (planId) {
      void fetchData()
    }
  }, [planId, toast])

  const filteredSolutions = solutions.filter((solution) =>
    solution.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const availableSolutions = filteredSolutions.filter((solution) => !selectedSolutions.includes(solution.id))

  const addSolutionToPlan = async (solutionId: number) => {
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
        throw new Error(errorData.error || `Erro ao adicionar solução: ${response.status}`)
      }

      setSelectedSolutions((current) => [...current, solutionId])
      setOpen(false)
      setSearchTerm("")

      toast({
        title: "Sucesso",
        description: "Solução adicionada ao plano com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao adicionar solução ao plano:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível adicionar a solução ao plano.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const removeSolutionFromPlan = async (solutionId: number) => {
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
        throw new Error(`Erro ao remover solução: ${response.status}`)
      }

      setSelectedSolutions((current) => current.filter((id) => id !== solutionId))

      toast({
        title: "Sucesso",
        description: "Solução removida do plano com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao remover solução do plano:", error)
      toast({
        title: "Erro",
        description: "Não foi possível remover a solução do plano.",
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
        <CardTitle>Gerenciar Soluções do Plano {plan?.name}</CardTitle>
        <CardDescription>
          Adicione ou remova soluções disponíveis para este plano. Os clientes com este plano só terão acesso às soluções
          selecionadas aqui.
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
                  <span>Adicionar solução...</span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 md:w-[340px]">
                <div className="space-y-2 p-3">
                  <Input
                    placeholder="Buscar solução..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                  <div className="max-h-[260px] overflow-y-auto">
                    {availableSolutions.length === 0 ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">Nenhuma solução encontrada.</div>
                    ) : (
                      <div className="space-y-1">
                        {availableSolutions.map((solution) => (
                          <button
                            key={solution.id}
                            type="button"
                            className="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                            onClick={() => void addSolutionToPlan(solution.id)}
                            disabled={saving}
                          >
                            <div className="min-w-0">
                              <div className="font-medium">{solution.name}</div>
                              <div className="truncate text-xs text-muted-foreground">
                                {solution.description || "Sem descrição"}
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
            {selectedSolutions.length > 0 ? (
              solutions
                .filter((solution) => selectedSolutions.includes(solution.id))
                .map((solution) => (
                  <div key={solution.id} className="flex items-center justify-between rounded-md border p-3 hover:bg-accent/50">
                    <div className="flex items-center gap-2">
                      <Checkbox checked disabled />
                      <div>
                        <p className="font-medium">{solution.name}</p>
                        <p className="line-clamp-1 text-sm text-muted-foreground">{solution.description || "Sem descrição"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {solution.category && <Badge variant="outline">{solution.category}</Badge>}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => void removeSolutionFromPlan(solution.id)}
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
                <h3 className="mt-3 text-lg font-medium">Nenhuma solução adicionada</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Este plano não possui soluções associadas. Adicione soluções para que os clientes deste plano possam
                  acessá-las.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          {selectedSolutions.length} {selectedSolutions.length === 1 ? "solução" : "soluções"} associadas a este plano
        </p>
      </CardFooter>
    </Card>
  )
}
