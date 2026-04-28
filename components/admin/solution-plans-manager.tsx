"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

// Tipos
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

  // Carregar dados dos planos e associações existentes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Buscar todos os planos
        const plansResponse = await fetch("/api/plans")
        if (!plansResponse.ok) {
          throw new Error(`Erro ao buscar planos: ${plansResponse.status}`)
        }
        const plansData = await plansResponse.json()
        setPlans(plansData)

        // Buscar planos associados à solução
        const planSolutionsResponse = await fetch(`/api/plan-solutions?solutionId=${solutionId}`)
        if (!planSolutionsResponse.ok) {
          throw new Error(`Erro ao buscar associações: ${planSolutionsResponse.status}`)
        }
        const planSolutionsData = await planSolutionsResponse.json()

        // Extrair IDs dos planos associados
        const selectedIds = planSolutionsData.map((ps: PlanSolution) => ps.plan_id)
        setSelectedPlans(selectedIds)
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
      fetchData()
    }
  }, [solutionId, toast])

  // Filtrar planos com base no termo de pesquisa
  const filteredPlans = plans.filter((plan) => plan.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Adicionar um plano à solução
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

      // Atualizar a lista de planos selecionados
      setSelectedPlans([...selectedPlans, planId])

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
      setOpen(false)
    }
  }

  // Remover um plano da solução
  const removePlanFromSolution = async (planId: number) => {
    try {
      setSaving(true)

      // Buscar o ID da associação
      const planSolutionsResponse = await fetch(`/api/plan-solutions?planId=${planId}&solutionId=${solutionId}`)
      if (!planSolutionsResponse.ok) {
        throw new Error(`Erro ao buscar associação: ${planSolutionsResponse.status}`)
      }
      const planSolutionsData = await planSolutionsResponse.json()

      if (!planSolutionsData || planSolutionsData.length === 0) {
        throw new Error("Associação não encontrada")
      }

      const associationId = planSolutionsData[0].id

      // Excluir a associação
      const response = await fetch(`/api/plan-solutions/${associationId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Erro ao remover plano: ${response.status}`)
      }

      // Atualizar a lista de planos selecionados
      setSelectedPlans(selectedPlans.filter((id) => id !== planId))

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

  // Renderizar esqueleto de carregamento
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64 mb-2" />
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
                  className="justify-between w-full md:w-[300px]"
                  disabled={saving}
                >
                  <span>Adicionar plano...</span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full md:w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Buscar plano..." onValueChange={setSearchTerm} />
                  <CommandList>
                    <CommandEmpty>Nenhum plano encontrado.</CommandEmpty>
                    <CommandGroup>
                      {filteredPlans
                        .filter((plan) => !selectedPlans.includes(plan.id))
                        .map((plan) => (
                          <CommandItem key={plan.id} value={plan.name} onSelect={() => addPlanToSolution(plan.id)}>
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedPlans.includes(plan.id) ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {plan.name}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            {selectedPlans.length > 0 ? (
              plans
                .filter((plan) => selectedPlans.includes(plan.id))
                .map((plan) => (
                  <div
                    key={plan.id}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/50"
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox checked disabled />
                      <div>
                        <p className="font-medium">{plan.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {plan.description || "Sem descrição"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">R$ {plan.price.toFixed(2)}</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removePlanFromSolution(plan.id)}
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
                <p className="mt-1 text-sm text-muted-foreground max-w-sm">
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
