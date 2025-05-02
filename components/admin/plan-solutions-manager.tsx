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

  // Carregar dados do plano e soluções associadas
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Buscar dados do plano
        const planResponse = await fetch(`/api/plans/${planId}`)
        if (!planResponse.ok) {
          throw new Error(`Erro ao buscar plano: ${planResponse.status}`)
        }
        const planData = await planResponse.json()
        setPlan(planData)

        // Buscar todas as soluções
        const solutionsResponse = await fetch("/api/solutions")
        if (!solutionsResponse.ok) {
          throw new Error(`Erro ao buscar soluções: ${solutionsResponse.status}`)
        }
        const solutionsData = await solutionsResponse.json()
        setSolutions(solutionsData)

        // Buscar soluções associadas ao plano
        const planSolutionsResponse = await fetch(`/api/plan-solutions?planId=${planId}`)
        if (!planSolutionsResponse.ok) {
          throw new Error(`Erro ao buscar associações: ${planSolutionsResponse.status}`)
        }
        const planSolutionsData = await planSolutionsResponse.json()

        // Extrair IDs das soluções associadas
        const selectedIds = planSolutionsData.map((ps: PlanSolution) => ps.solution_id)
        setSelectedSolutions(selectedIds)
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
      fetchData()
    }
  }, [planId, toast])

  // Filtrar soluções com base no termo de pesquisa
  const filteredSolutions = solutions.filter((solution) =>
    solution.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Adicionar uma solução ao plano
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

      // Atualizar a lista de soluções selecionadas
      setSelectedSolutions([...selectedSolutions, solutionId])

      toast({
        title: "Sucesso",
        description: "Solução adicionada ao plano com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao adicionar solução ao plano:", error)
      toast({
        title: "Erro",
        description: error.message || "Não foi possível adicionar a solução ao plano.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
      setOpen(false)
    }
  }

  // Remover uma solução do plano
  const removeSolutionFromPlan = async (solutionId: number) => {
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
        throw new Error(`Erro ao remover solução: ${response.status}`)
      }

      // Atualizar a lista de soluções selecionadas
      setSelectedSolutions(selectedSolutions.filter((id) => id !== solutionId))

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
        <CardTitle>Gerenciar Soluções do Plano {plan?.name}</CardTitle>
        <CardDescription>
          Adicione ou remova soluções disponíveis para este plano. Os clientes com este plano só terão acesso às
          soluções selecionadas aqui.
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
                  <span>Adicionar solução...</span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full md:w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Buscar solução..." onValueChange={setSearchTerm} />
                  <CommandList>
                    <CommandEmpty>Nenhuma solução encontrada.</CommandEmpty>
                    <CommandGroup>
                      {filteredSolutions
                        .filter((solution) => !selectedSolutions.includes(solution.id))
                        .map((solution) => (
                          <CommandItem
                            key={solution.id}
                            value={solution.name}
                            onSelect={() => addSolutionToPlan(solution.id)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedSolutions.includes(solution.id) ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {solution.name}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            {selectedSolutions.length > 0 ? (
              solutions
                .filter((solution) => selectedSolutions.includes(solution.id))
                .map((solution) => (
                  <div
                    key={solution.id}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/50"
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox checked disabled />
                      <div>
                        <p className="font-medium">{solution.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {solution.description || "Sem descrição"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {solution.category && <Badge variant="outline">{solution.category}</Badge>}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSolutionFromPlan(solution.id)}
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
                <p className="mt-1 text-sm text-muted-foreground max-w-sm">
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
