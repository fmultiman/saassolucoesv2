"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  BarChart,
  CheckCircle,
  Clock,
  Download,
  Filter,
  MoreHorizontal,
  Search,
  Settings,
  Users,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

type ModalType = "metrics" | "clients" | "settings" | null

export function AdminActiveSolutionsList({ filter }: AdminActiveSolutionsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [loading, setLoading] = useState(true)
  const [solutionPlans, setSolutionPlans] = useState<Record<string, string>>({})
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null)
  const [solutionToDeactivate, setSolutionToDeactivate] = useState<Solution | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const fetchSolutionPlans = async (solutionId: string) => {
    try {
      const response = await fetch(`/api/solutions/${solutionId}/plans`)
      if (!response.ok) {
        throw new Error(`Erro ao buscar planos: ${response.status}`)
      }

      const plans = await response.json()
      return plans.map((plan: { name: string }) => plan.name).join(", ") || "Nenhum"
    } catch (error) {
      console.error(`Erro ao buscar planos para solução ${solutionId}:`, error)
      return "Erro"
    }
  }

  useEffect(() => {
    void loadActiveSolutions()
  }, [])

  const loadActiveSolutions = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/solutions/active")

      if (!response.ok) {
        throw new Error(`Erro ao buscar soluções: ${response.status}`)
      }

      const data = await response.json()
      setSolutions(data)

      if (data.length > 0) {
        const plansMap: Record<string, string> = {}
        for (const solution of data) {
          plansMap[solution.id] = await fetchSolutionPlans(solution.id)
        }
        setSolutionPlans(plansMap)
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

  const filteredSolutions = useMemo(
    () =>
      solutions.filter((solution) => {
        const matchesCategory = filter === "todas" || solution.category?.toLowerCase() === filter
        const matchesSearch = solution.name.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesCategory && matchesSearch
      }),
    [filter, searchTerm, solutions],
  )

  const openModal = (type: ModalType, solution: Solution) => {
    setSelectedSolution(solution)
    window.setTimeout(() => setActiveModal(type), 0)
  }

  const deactivateSolution = async () => {
    if (!solutionToDeactivate) return

    try {
      setIsUpdating(true)

      const response = await fetch(`/api/solutions/${solutionToDeactivate.id}/toggle-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: false }),
      })

      if (!response.ok) {
        throw new Error(`Erro ao desativar solução: ${response.status}`)
      }

      setSolutions((current) => current.filter((solution) => solution.id !== solutionToDeactivate.id))
      toast({
        title: "Sucesso",
        description: `Solução "${solutionToDeactivate.name}" desativada com sucesso.`,
      })
      setSolutionToDeactivate(null)
    } catch (error) {
      console.error("Erro ao desativar solução:", error)
      toast({
        title: "Erro",
        description: "Não foi possível desativar a solução. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-start justify-between gap-4 p-4 sm:flex-row sm:items-center">
          <Skeleton className="h-10 w-72" />
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>

        <div className="rounded-md border">
          <div className="p-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center space-x-4 py-4">
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
    <>
      <div className="space-y-4">
        <div className="flex flex-col items-start justify-between gap-4 p-4 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar soluções..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="flex w-full items-center gap-2 sm:w-auto">
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
                          <DropdownMenuItem
                            onSelect={(event) => {
                              event.preventDefault()
                              openModal("metrics", solution)
                            }}
                          >
                            <BarChart className="mr-2 h-4 w-4" />
                            <span>Ver métricas</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={(event) => {
                              event.preventDefault()
                              openModal("clients", solution)
                            }}
                          >
                            <Users className="mr-2 h-4 w-4" />
                            <span>Ver clientes</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onSelect={(event) => {
                              event.preventDefault()
                              openModal("settings", solution)
                            }}
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Configurar</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onSelect={(event) => {
                              event.preventDefault()
                              window.setTimeout(() => setSolutionToDeactivate(solution), 0)
                            }}
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Desativar</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Nenhuma solução ativa encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between px-4 py-2">
          <p className="text-sm text-muted-foreground">
            Mostrando {filteredSolutions.length} de {solutions.length} soluções ativas
          </p>
        </div>
      </div>

      <Dialog
        open={!!activeModal}
        onOpenChange={(open) => {
          if (!open) {
            setActiveModal(null)
            setSelectedSolution(null)
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          {activeModal === "metrics" && selectedSolution && (
            <>
              <DialogHeader>
                <DialogTitle>Métricas da Solução</DialogTitle>
                <DialogDescription>
                  Visão rápida da operação atual de <strong>{selectedSolution.name}</strong>.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Planos vinculados</p>
                  <p className="mt-2 text-2xl font-semibold">
                    {solutionPlans[selectedSolution.id]
                      ? solutionPlans[selectedSolution.id].split(",").filter(Boolean).length
                      : 0}
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Tipo de acesso</p>
                  <p className="mt-2 text-2xl font-semibold">
                    {selectedSolution.is_premium ? "Premium" : "Padrão"}
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="mt-2 text-2xl font-semibold">Ativo</p>
                </div>
              </div>
              <div className="space-y-2 rounded-lg border p-4 text-sm">
                <p>
                  <strong>Categoria:</strong> {selectedSolution.category || "Sem categoria"}
                </p>
                <p>
                  <strong>Criada em:</strong> {new Date(selectedSolution.created_at).toLocaleDateString()}
                </p>
                <p>
                  <strong>Planos associados:</strong> {solutionPlans[selectedSolution.id] || "Nenhum"}
                </p>
                <p className="text-muted-foreground">
                  A telemetria detalhada dessa solução ainda pode ser expandida depois, mas este modal já centraliza o
                  contexto operacional mais útil para o admin.
                </p>
              </div>
            </>
          )}

          {activeModal === "clients" && selectedSolution && (
            <>
              <DialogHeader>
                <DialogTitle>Clientes da Solução</DialogTitle>
                <DialogDescription>
                  Acompanhamento administrativo de quem pode usar <strong>{selectedSolution.name}</strong>.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-medium">Planos com acesso</p>
                  <p className="mt-2 text-sm text-muted-foreground">{solutionPlans[selectedSolution.id] || "Nenhum"}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-medium">Uso recomendado deste modal</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    <li>Conferir se a solução está vinculada aos planos certos.</li>
                    <li>Validar se a visibilidade do catálogo bate com a estratégia comercial.</li>
                    <li>Seguir para a gestão de planos quando precisar liberar ou restringir acesso.</li>
                  </ul>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-medium">Observação</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    A lista nominal de clientes ativados ainda depende da camada de rastreamento por ativação. Por
                    enquanto, o vínculo principal é o plano associado à solução.
                  </p>
                </div>
              </div>
            </>
          )}

          {activeModal === "settings" && selectedSolution && (
            <>
              <DialogHeader>
                <DialogTitle>Configurar Solução</DialogTitle>
                <DialogDescription>
                  Resumo administrativo e atalhos para ajustar <strong>{selectedSolution.name}</strong>.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="rounded-lg border p-4 text-sm">
                  <p>
                    <strong>Descrição:</strong> {selectedSolution.description || "Sem descrição"}
                  </p>
                  <p className="mt-2">
                    <strong>Categoria:</strong> {selectedSolution.category || "Sem categoria"}
                  </p>
                  <p className="mt-2">
                    <strong>Plano premium:</strong> {selectedSolution.premium_plan || "Não se aplica"}
                  </p>
                  <p className="mt-2">
                    <strong>Planos associados:</strong> {solutionPlans[selectedSolution.id] || "Nenhum"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild>
                    <Link href={`/admin/solucoes/${selectedSolution.id}/planos`}>Gerenciar planos da solução</Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setActiveModal(null)
                      setSelectedSolution(null)
                      window.setTimeout(() => setSolutionToDeactivate(selectedSolution), 0)
                    }}
                  >
                    Desativar solução
                  </Button>
                </div>
              </div>
            </>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActiveModal(null)
                setSelectedSolution(null)
              }}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!solutionToDeactivate}
        onOpenChange={(open) => {
          if (!open && !isUpdating) setSolutionToDeactivate(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desativar solução</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja desativar <strong>{solutionToDeactivate?.name}</strong>? Ela deixará de aparecer
              como solução ativa na operação.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={deactivateSolution}
              disabled={isUpdating}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isUpdating ? "Desativando..." : "Desativar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
