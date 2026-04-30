"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MoreHorizontal, Edit, Trash2, Eye, Check, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { TruncatedDescription } from "@/components/truncated-description"
import type { Plan } from "@/lib/services/plans-service"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlanSolutionsManager } from "./plan-solutions-manager"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import Link from "next/link"

export function AdminPlansList() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [sortColumn, setSortColumn] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSolutionsDialogOpen, setIsSolutionsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null)
  const [openMenuPlanId, setOpenMenuPlanId] = useState<number | null>(null)
  const [newPlan, setNewPlan] = useState({
    name: "",
    description: "",
    price: "",
    billing_cycle: "mensal",
    max_solutions: "",
    features: [] as string[],
  })
  const { toast } = useToast()

  // Adicione o estado para armazenar a contagem de soluções de cada plano
  const [planSolutionCounts, setPlanSolutionCounts] = useState<Record<number, number>>({})

  // Adicione esta função para buscar a contagem de soluções de cada plano
  const fetchPlanSolutionCount = async (planId: number) => {
    try {
      const response = await fetch(`/api/plans/${planId}/solutions?count=true`)
      if (!response.ok) {
        throw new Error(`Erro ao buscar contagem: ${response.status}`)
      }

      const data = await response.json()
      return data.count || 0
    } catch (error) {
      console.error(`Erro ao buscar contagem para plano ${planId}:`, error)
      return 0
    }
  }

  // Carregar planos do Supabase
  useEffect(() => {
    loadPlans()
  }, [])

  const requestPlans = async (input: string, init?: RequestInit) => {
    const response = await fetch(input, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => null)
      throw new Error(payload?.error || `Erro na requisição: ${response.status}`)
    }

    return response.json()
  }

  const loadPlans = async () => {
    try {
      setLoading(true)
      const data = (await requestPlans("/api/plans")) as Plan[]
      setPlans(data)

      // Após carregar os planos, buscar a contagem de soluções para cada um
      const countsMap: Record<number, number> = {}

      for (const plan of data) {
        const count = await fetchPlanSolutionCount(plan.id)
        countsMap[plan.id] = count
      }

      setPlanSolutionCounts(countsMap)
    } catch (error) {
      console.error("Erro ao carregar planos:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os planos. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const formatPrice = (price: number | null, cycle: string | null) => {
    if (price === 0 || price === null) return "Gratuito"
    return `R$ ${price.toLocaleString()}/${cycle === "anual" ? "ano" : "mês"}`
  }

  const openEditDialog = (plan: Plan | null = null) => {
    if (plan) {
      setEditingPlan(plan)
      setNewPlan({
        name: plan.name,
        description: plan.description || "",
        price: plan.price?.toString() || "",
        billing_cycle: plan.billing_cycle || "mensal",
        max_solutions: plan.max_solutions?.toString() || "",
        features: Array.isArray(plan.features) ? plan.features.filter((feature): feature is string => typeof feature === "string") : [],
      })
    } else {
      setEditingPlan(null)
      setNewPlan({
        name: "",
        description: "",
        price: "",
        billing_cycle: "mensal",
        max_solutions: "",
        features: [],
      })
    }
    setIsDialogOpen(true)
  }

  const openSolutionsDialog = (plan: Plan) => {
    setOpenMenuPlanId(null)
    setEditingPlan(plan)
    window.setTimeout(() => {
      setIsSolutionsDialogOpen(true)
    }, 0)
  }

  const confirmDelete = (plan: Plan) => {
    setOpenMenuPlanId(null)
    setPlanToDelete(plan)
    window.setTimeout(() => {
      setIsDeleteDialogOpen(true)
    }, 0)
  }

  const handleSavePlan = async () => {
    try {
      if (!newPlan.name.trim()) {
        toast({
          title: "Erro",
          description: "O nome do plano é obrigatório.",
          variant: "destructive",
        })
        return
      }

      const planData = {
        name: newPlan.name,
        description: newPlan.description,
        price: newPlan.price ? Number.parseFloat(newPlan.price) : null,
        billing_cycle: newPlan.billing_cycle,
        interval: newPlan.billing_cycle === "anual" ? "year" : "month",
        max_solutions: newPlan.max_solutions ? Number.parseInt(newPlan.max_solutions, 10) : null,
        features: newPlan.features,
      }

      if (editingPlan) {
        // Atualizar plano existente
        const updated = (await requestPlans(`/api/plans/${editingPlan.id}`, {
          method: "PUT",
          body: JSON.stringify(planData),
        })) as Plan
        setPlans(plans.map((p) => (p.id === editingPlan.id ? updated : p)))
        toast({
          title: "Sucesso",
          description: "Plano atualizado com sucesso.",
        })
      } else {
        // Criar novo plano
        const created = (await requestPlans("/api/plans", {
          method: "POST",
          body: JSON.stringify(planData),
        })) as Plan
        setPlans([...plans, created])
        toast({
          title: "Sucesso",
          description: "Plano criado com sucesso.",
        })
      }

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Erro ao salvar plano:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar o plano. Tente novamente mais tarde.",
        variant: "destructive",
      })
    }
  }

  const handleDeletePlan = async () => {
    if (!planToDelete) return

    try {
      await requestPlans(`/api/plans/${planToDelete.id}`, { method: "DELETE" })
      setPlans(plans.filter((p) => p.id !== planToDelete.id))
      toast({
        title: "Sucesso",
        description: "Plano excluído com sucesso.",
      })
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Erro ao excluir plano:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o plano. Tente novamente mais tarde.",
        variant: "destructive",
      })
    }
  }

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...newPlan.features]
    updatedFeatures[index] = value
    setNewPlan({ ...newPlan, features: updatedFeatures })
  }

  const addFeature = () => {
    setNewPlan({ ...newPlan, features: [...newPlan.features, ""] })
  }

  const removeFeature = (index: number) => {
    const updatedFeatures = [...newPlan.features]
    updatedFeatures.splice(index, 1)
    setNewPlan({ ...newPlan, features: updatedFeatures })
  }

  // Renderizar esqueleto de carregamento
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center space-x-4 py-4">
            <Skeleton className="h-6 w-1/6" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-1/6" />
            <Skeleton className="h-6 w-1/6" />
            <Skeleton className="h-6 w-1/6" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        ))}
      </div>
    )
  }

  const TableHeaderCell = ({ children }: { children: React.ReactNode }) => {
    return <TableHead className="text-left font-medium">{children}</TableHead>
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => openEditDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Plano
        </Button>
      </div>

      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Nome</TableHeaderCell>
                <TableHeaderCell>Descrição</TableHeaderCell>
                <TableHeaderCell>Preço</TableHeaderCell>
                <TableHeaderCell>Soluções</TableHeaderCell>
                <TableHeaderCell>Max. Ativas</TableHeaderCell>
                <TableHeaderCell>Ciclo</TableHeaderCell>
                <TableHeaderCell>Recursos</TableHeaderCell>
                <TableHeaderCell>Ações</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>{plan.name}</TableCell>
                  <TableCell>
                    <TruncatedDescription text={plan.description || ""} maxLength={50} />
                  </TableCell>
                  <TableCell>{formatPrice(plan.price, plan.billing_cycle)}</TableCell>
                  <TableCell>
                    {planSolutionCounts[plan.id] !== undefined ? (
                      <Link href={`/admin/planos/${plan.id}/solucoes`} className="text-primary hover:underline">
                        {planSolutionCounts[plan.id]} soluções
                      </Link>
                    ) : (
                      <Skeleton className="h-4 w-20" />
                    )}
                  </TableCell>
                  <TableCell>{plan.max_solutions ?? <span className="text-muted-foreground">Ilimitado</span>}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{plan.billing_cycle === "anual" ? "Anual" : "Mensal"}</Badge>
                  </TableCell>
                  <TableCell>
                    {Array.isArray(plan.features) && plan.features.length > 0 ? (
                      <Badge variant="outline">{plan.features.length} recursos</Badge>
                    ) : (
                      <span className="text-muted-foreground">Nenhum</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" title="Visualizar">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Editar" onClick={() => openEditDialog(plan)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <DropdownMenu
                        open={openMenuPlanId === plan.id}
                        onOpenChange={(open) => setOpenMenuPlanId(open ? plan.id : null)}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => openSolutionsDialog(plan)}>
                            <Check className="mr-2 h-4 w-4" />
                            Gerenciar Soluções
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => confirmDelete(plan)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Diálogo para criar/editar plano */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingPlan ? "Editar Plano" : "Novo Plano"}</DialogTitle>
            <DialogDescription>
              {editingPlan ? "Edite os detalhes do plano existente." : "Preencha os detalhes para criar um novo plano."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={newPlan.name}
                onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Descrição
              </Label>
              <Textarea
                id="description"
                value={newPlan.description}
                onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Preço
              </Label>
              <Input
                id="price"
                type="number"
                value={newPlan.price}
                onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                className="col-span-3"
                placeholder="0 para plano gratuito"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="billing_cycle" className="text-right">
                Ciclo
              </Label>
              <select
                id="billing_cycle"
                value={newPlan.billing_cycle}
                onChange={(e) => setNewPlan({ ...newPlan, billing_cycle: e.target.value })}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="mensal">Mensal</option>
                <option value="anual">Anual</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="max_solutions" className="text-right">
                Max. Ativas
              </Label>
              <Input
                id="max_solutions"
                type="number"
                min="0"
                value={newPlan.max_solutions}
                onChange={(e) => setNewPlan({ ...newPlan, max_solutions: e.target.value })}
                className="col-span-3"
                placeholder="Deixe em branco para ilimitado"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Recursos</Label>
              <div className="col-span-3 space-y-2">
                {newPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder={`Recurso ${index + 1}`}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFeature(index)}
                      className="text-destructive hover:text-destructive/90"
                      title="Remover recurso"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addFeature} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Recurso
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePlan}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para gerenciar soluções do plano */}
      <Dialog open={isSolutionsDialogOpen} onOpenChange={setIsSolutionsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gerenciar Soluções do Plano</DialogTitle>
            <DialogDescription>
              Selecione as soluções que estarão disponíveis para o plano "{editingPlan?.name}".
            </DialogDescription>
          </DialogHeader>
          {editingPlan && (
            <PlanSolutionsManager planId={editingPlan.id} onClose={() => setIsSolutionsDialogOpen(false)} />
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o plano "{planToDelete?.name}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeletePlan}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
