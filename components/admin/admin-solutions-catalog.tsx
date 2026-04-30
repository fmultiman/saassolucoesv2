"use client"

import { useState, useEffect } from "react"
import { Edit, Filter, MoreHorizontal, Plus, Search, Trash2, Info } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"

// Tipo para as soluções
type Solution = {
  id: number
  name: string
  description: string | null
  category: string | null
  is_active: boolean
  is_premium?: boolean
  premium_plan?: string | null
  created_at?: string
  updated_at?: string
  plan_count?: number
}

// Tipo para os planos
type Plan = {
  id: number
  name: string
  description: string | null
  price: number
}

export function AdminSolutionsCatalog() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("todas")
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingSolution, setEditingSolution] = useState<Solution | null>(null)
  const [newSolution, setNewSolution] = useState({
    name: "",
    description: "",
    category: "",
    is_active: true,
  })
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [solutionToDelete, setSolutionToDelete] = useState<Solution | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [planAssociations, setPlanAssociations] = useState<Record<number, number[]>>({})
  const [openMenuSolutionId, setOpenMenuSolutionId] = useState<number | null>(null)

  const { toast } = useToast()

  // Carregar soluções e planos da API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        // Carregar soluções
        const solutionsResponse = await fetch("/api/solutions")
        if (!solutionsResponse.ok) {
          throw new Error(`Erro ao buscar soluções: ${solutionsResponse.status}`)
        }
        const solutionsData = await solutionsResponse.json()

        // Carregar planos
        const plansResponse = await fetch("/api/plans")
        if (!plansResponse.ok) {
          throw new Error(`Erro ao buscar planos: ${plansResponse.status}`)
        }
        const plansData = await plansResponse.json()
        setPlans(plansData)

        // Carregar associações entre planos e soluções
        const planSolutionsResponse = await fetch("/api/plan-solutions")
        if (!planSolutionsResponse.ok) {
          throw new Error(`Erro ao buscar associações: ${planSolutionsResponse.status}`)
        }
        const planSolutionsData = await planSolutionsResponse.json()

        // Organizar as associações por solução
        const associations: Record<number, number[]> = {}
        planSolutionsData.forEach((ps: { plan_id: number; solution_id: number }) => {
          if (!associations[ps.solution_id]) {
            associations[ps.solution_id] = []
          }
          associations[ps.solution_id].push(ps.plan_id)
        })
        setPlanAssociations(associations)

        // Adicionar contagem de planos às soluções
        const enrichedSolutions = solutionsData.map((solution: Solution) => ({
          ...solution,
          plan_count: associations[solution.id]?.length || 0,
        }))

        setSolutions(enrichedSolutions)
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

    loadData()
  }, [toast])

  // Filtra as soluções com base na categoria e termo de pesquisa
  const filteredSolutions = solutions.filter((solution) => {
    const matchesCategory = categoryFilter === "todas" || solution.category?.toLowerCase() === categoryFilter
    const matchesSearch = solution.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Função para renderizar o badge de categoria
  const renderCategoryBadge = (category: string | null) => {
    if (!category) return <Badge variant="outline">Sem categoria</Badge>

    const categoryMap: Record<string, { label: string; color: string }> = {
      atendimento: { label: "Atendimento", color: "bg-blue-500 hover:bg-blue-600" },
      vendas: { label: "Vendas", color: "bg-green-500 hover:bg-green-600" },
      relacionamento: { label: "Relacionamento", color: "bg-pink-500 hover:bg-pink-600" },
      agendamento: { label: "Agendamento", color: "bg-purple-500 hover:bg-purple-600" },
      feedback: { label: "Feedback", color: "bg-orange-500 hover:bg-orange-600" },
      marketing: { label: "Marketing", color: "bg-red-500 hover:bg-red-600" },
      "redes-sociais": { label: "Redes Sociais", color: "bg-indigo-500 hover:bg-indigo-600" },
      administracao: { label: "Administração", color: "bg-slate-500 hover:bg-slate-600" },
    }

    const lowerCategory = category.toLowerCase()
    const categoryInfo = categoryMap[lowerCategory] || { label: category, color: "bg-gray-500 hover:bg-gray-600" }

    return <Badge className={categoryInfo.color}>{categoryInfo.label}</Badge>
  }

  // Função para alternar o status de uma solução
  const toggleSolutionStatus = async (solution: Solution) => {
    try {
      const response = await fetch(`/api/solutions/${solution.id}/toggle-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: !solution.is_active }),
      })

      if (!response.ok) {
        throw new Error(`Erro ao alterar status: ${response.status}`)
      }

      const updatedSolution = await response.json()

      // Atualizar o estado local
      setSolutions(solutions.map((s) => (s.id === solution.id ? { ...updatedSolution, plan_count: s.plan_count } : s)))

      toast({
        title: "Sucesso",
        description: `Solução ${solution.is_active ? "desativada" : "ativada"} com sucesso.`,
      })
    } catch (error) {
      console.error("Erro ao alternar status da solução:", error)
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status da solução.",
        variant: "destructive",
      })
    }
  }

  // Função para abrir o diálogo de edição
  const openEditDialog = (solution: Solution | null = null) => {
    setOpenMenuSolutionId(null)
    if (solution) {
      setEditingSolution(solution)
      setNewSolution({
        name: solution.name,
        description: solution.description || "",
        category: solution.category || "",
        is_active: solution.is_active,
      })
    } else {
      setEditingSolution(null)
      setNewSolution({
        name: "",
        description: "",
        category: "",
        is_active: true,
      })
    }
    setOpenDialog(true)
  }

  // Função para salvar uma solução (criar ou atualizar)
  const saveSolution = async () => {
    try {
      setIsSubmitting(true)

      if (!newSolution.name.trim()) {
        toast({
          title: "Erro",
          description: "O nome da solução é obrigatório.",
          variant: "destructive",
        })
        return
      }

      let response

      if (editingSolution) {
        // Atualizar solução existente
        response = await fetch(`/api/solutions/${editingSolution.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newSolution.name,
            description: newSolution.description || null,
            category: newSolution.category || null,
            is_active: newSolution.is_active,
          }),
        })
      } else {
        // Criar nova solução
        response = await fetch("/api/solutions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newSolution.name,
            description: newSolution.description || null,
            category: newSolution.category || null,
            is_active: newSolution.is_active,
          }),
        })
      }

      if (!response.ok) {
        throw new Error(`Erro ao salvar solução: ${response.status}`)
      }

      const data = await response.json()

      if (editingSolution) {
        setSolutions(solutions.map((s) => (s.id === editingSolution.id ? { ...data, plan_count: s.plan_count } : s)))
        toast({
          title: "Sucesso",
          description: "Solução atualizada com sucesso.",
        })
      } else {
        setSolutions([...solutions, { ...data, plan_count: 0 }])
        toast({
          title: "Sucesso",
          description: "Solução criada com sucesso.",
        })
      }

      setOpenDialog(false)
    } catch (error) {
      console.error("Erro ao salvar solução:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar a solução. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Função para confirmar exclusão de uma solução
  const confirmDelete = (solution: Solution) => {
    setOpenMenuSolutionId(null)
    setSolutionToDelete(solution)
    window.setTimeout(() => setDeleteConfirmOpen(true), 0)
  }

  // Função para excluir uma solução
  const deleteSolution = async () => {
    if (!solutionToDelete) return

    try {
      setIsSubmitting(true)

      const response = await fetch(`/api/solutions/${solutionToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Erro ao excluir solução: ${response.status}`)
      }

      // Atualizar o estado local
      setSolutions(solutions.filter((s) => s.id !== solutionToDelete.id))

      toast({
        title: "Sucesso",
        description: "Solução excluída com sucesso.",
      })

      setDeleteConfirmOpen(false)
    } catch (error) {
      console.error("Erro ao excluir solução:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a solução. Ela pode estar associada a planos.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Renderizar esqueleto de carregamento
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4">
          <Skeleton className="h-10 w-72" />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="rounded-md border">
          <div className="p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4 py-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 flex-1" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar soluções..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select defaultValue="todas" onValueChange={(value) => setCategoryFilter(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as categorias</SelectItem>
              <SelectItem value="atendimento">Atendimento</SelectItem>
              <SelectItem value="vendas">Vendas</SelectItem>
              <SelectItem value="relacionamento">Relacionamento</SelectItem>
              <SelectItem value="agendamento">Agendamento</SelectItem>
              <SelectItem value="feedback">Feedback</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="redes-sociais">Redes Sociais</SelectItem>
              <SelectItem value="administracao">Administração</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button onClick={() => openEditDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Solução
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome da Solução</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Planos</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSolutions.length > 0 ? (
              filteredSolutions.map((solution) => (
                <TableRow key={solution.id}>
                  <TableCell className="font-medium">{solution.name}</TableCell>
                  <TableCell>{renderCategoryBadge(solution.category)}</TableCell>
                  <TableCell className="max-w-xs truncate">{solution.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{solution.plan_count || 0}</Badge>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/admin/solucoes/${solution.id}/planos`}>
                                <Info className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Ver planos associados</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch checked={solution.is_active} onCheckedChange={() => toggleSolutionStatus(solution)} />
                      <span>{solution.is_active ? "Ativo" : "Inativo"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu
                      open={openMenuSolutionId === solution.id}
                      onOpenChange={(open) => setOpenMenuSolutionId(open ? solution.id : null)}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => openEditDialog(solution)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onSelect={() => confirmDelete(solution)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Excluir</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhuma solução encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center px-4 py-2">
        <p className="text-sm text-muted-foreground">
          Mostrando {filteredSolutions.length} de {solutions.length} soluções
        </p>
      </div>

      {/* Diálogo para criar/editar solução */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingSolution ? "Editar Solução" : "Nova Solução"}</DialogTitle>
            <DialogDescription>
              {editingSolution
                ? "Edite os detalhes da solução existente."
                : "Preencha os detalhes para criar uma nova solução."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={newSolution.name}
                onChange={(e) => setNewSolution({ ...newSolution, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Categoria
              </Label>
              <Select
                value={newSolution.category}
                onValueChange={(value) => setNewSolution({ ...newSolution, category: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="atendimento">Atendimento</SelectItem>
                  <SelectItem value="vendas">Vendas</SelectItem>
                  <SelectItem value="relacionamento">Relacionamento</SelectItem>
                  <SelectItem value="agendamento">Agendamento</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="redes-sociais">Redes Sociais</SelectItem>
                  <SelectItem value="administracao">Administração</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Descrição
              </Label>
              <Textarea
                id="description"
                value={newSolution.description}
                onChange={(e) => setNewSolution({ ...newSolution, description: e.target.value })}
                className="col-span-3"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="status"
                  checked={newSolution.is_active}
                  onCheckedChange={(checked) => setNewSolution({ ...newSolution, is_active: checked })}
                />
                <Label htmlFor="status">{newSolution.is_active ? "Ativo" : "Inativo"}</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button onClick={saveSolution} disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a solução "{solutionToDelete?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deleteSolution} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">
              {isSubmitting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
