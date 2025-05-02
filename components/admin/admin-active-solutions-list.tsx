"use client"

import { useState, useEffect } from "react"
import { BarChart, CheckCircle, Clock, Download, Filter, MoreHorizontal, Search, Settings, Users } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

interface Solution {
  id: string
  name: string
  description: string
  category: string
  is_active: boolean
  created_at: string
  is_premium: boolean
  premium_plan: string | null
}

interface AdminActiveSolutionsListProps {
  filter: string
}

export function AdminActiveSolutionsList({ filter }: AdminActiveSolutionsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Adicione o estado para armazenar os planos de cada solução
  const [solutionPlans, setSolutionPlans] = useState<Record<string, string>>({})

  // Adicione esta função para buscar os planos de cada solução
  const fetchSolutionPlans = async (solutionId: string) => {
    try {
      const response = await fetch(`/api/solutions/${solutionId}/plans`)
      if (!response.ok) {
        throw new Error(`Erro ao buscar planos: ${response.status}`)
      }

      const plans = await response.json()
      return plans.map((plan: any) => plan.name).join(", ") || "Nenhum"
    } catch (error) {
      console.error(`Erro ao buscar planos para solução ${solutionId}:`, error)
      return "Erro"
    }
  }

  // Carregar soluções ativas da API
  useEffect(() => {
    loadActiveSolutions()
  }, [])

  const loadActiveSolutions = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/solutions/active")

      if (!response.ok) {
        throw new Error(`Erro ao buscar soluções: ${response.status}`)
      }

      const data = await response.json()
      console.log("Soluções ativas carregadas (admin):", data)
      setSolutions(data)

      // Após carregar as soluções, buscar os planos para cada uma
      if (data.length > 0) {
        const loadPlans = async () => {
          const plansMap: Record<string, string> = {}

          for (const solution of data) {
            const plansList = await fetchSolutionPlans(solution.id)
            plansMap[solution.id] = plansList
          }

          setSolutionPlans(plansMap)
        }

        loadPlans()
      }
    } catch (error) {
      console.error("Erro ao carregar soluções ativas:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as soluções ativas. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filtra as soluções com base na categoria e termo de pesquisa
  const filteredSolutions = solutions.filter((solution) => {
    const matchesCategory = filter === "todas" || solution.category?.toLowerCase() === filter
    const matchesSearch = solution.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Função para desativar uma solução
  const deactivateSolution = async (solution: Solution) => {
    try {
      // Chamada para a API para desativar a solução
      const response = await fetch(`/api/solutions/${solution.id}/toggle-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: false }),
      })

      if (!response.ok) {
        throw new Error(`Erro ao desativar solução: ${response.status}`)
      }

      // Remover a solução da lista local
      setSolutions(solutions.filter((s) => s.id !== solution.id))

      toast({
        title: "Sucesso",
        description: `Solução "${solution.name}" desativada com sucesso.`,
      })
    } catch (error) {
      console.error("Erro ao desativar solução:", error)
      toast({
        title: "Erro",
        description: "Não foi possível desativar a solução. Tente novamente mais tarde.",
        variant: "destructive",
      })
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
            <Skeleton className="h-10 w-10" />
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
          <Select defaultValue="recentes">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recentes">Mais recentes</SelectItem>
              <SelectItem value="nome">Nome</SelectItem>
              <SelectItem value="categoria">Categoria</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome da Solução</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Planos</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSolutions.length > 0 ? (
              filteredSolutions.map((solution) => (
                <TableRow key={solution.id}>
                  <TableCell className="font-medium">{solution.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Ativo</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {solution.category ? (
                      <Badge variant="outline">{solution.category}</Badge>
                    ) : (
                      <span className="text-muted-foreground">Sem categoria</span>
                    )}
                  </TableCell>
                  <TableCell>{solutionPlans[solution.id] || <Skeleton className="h-4 w-24" />}</TableCell>
                  <TableCell className="max-w-xs truncate">{solution.description || "Sem descrição"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(solution.created_at).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <BarChart className="mr-2 h-4 w-4" />
                          <span>Ver métricas</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="mr-2 h-4 w-4" />
                          <span>Ver clientes</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Configurar</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => deactivateSolution(solution)}>
                          <Switch className="mr-2" />
                          <span>Desativar</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhuma solução ativa encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center px-4 py-2">
        <p className="text-sm text-muted-foreground">
          Mostrando {filteredSolutions.length} de {solutions.length} soluções ativas
        </p>
      </div>
    </div>
  )
}
