"use client"

import { useEffect, useMemo, useState } from "react"
import { BarChart2, Check, Edit, Eye, EyeOff, Plus, Search, Trash2, X } from "lucide-react"
import { marketplaceProducts as fallbackMarketplaceProducts } from "./admin-marketplace-data"
import type { AdminMarketplaceItem } from "@/lib/services/marketplace-service"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

function createEmptyProduct(): AdminMarketplaceItem {
  return {
    id: crypto.randomUUID(),
    name: "",
    description: "",
    fullDescription: "",
    category: "service",
    relatedArea: "all-areas",
    minPlan: "free",
    status: "active",
    clientAction: "Ver mais",
    showInstitutional: true,
    showDashboard: true,
    views: 0,
    clicks: 0,
    activations: 0,
    lastAccess: null,
    type: "service",
    categories: ["service"],
    requiresLogin: false,
    displayStatus: "available",
  }
}

export function AdminMarketplaceManager() {
  const [products, setProducts] = useState<AdminMarketplaceItem[]>(fallbackMarketplaceProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [areaFilter, setAreaFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<AdminMarketplaceItem | null>(null)
  const [isStatsDialogOpen, setIsStatsDialogOpen] = useState(false)
  const [currentStats, setCurrentStats] = useState<AdminMarketplaceItem | null>(null)
  const [productToDelete, setProductToDelete] = useState<AdminMarketplaceItem | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadProducts() {
      try {
        const response = await fetch("/api/admin/marketplace", {
          method: "GET",
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error(`Erro ao carregar marketplace: ${response.status}`)
        }

        const payload = (await response.json()) as AdminMarketplaceItem[]

        if (isMounted && Array.isArray(payload)) {
          setProducts(payload)
        }
      } catch {
        if (isMounted) {
          setProducts(fallbackMarketplaceProducts)
        }
      }
    }

    void loadProducts()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    if (searchTerm) {
      filtered = filtered.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((product) => product.category === categoryFilter)
    }

    if (areaFilter !== "all") {
      filtered = filtered.filter((product) => product.relatedArea === areaFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((product) => product.status === statusFilter)
    }

    if (planFilter !== "all") {
      filtered = filtered.filter((product) => product.minPlan === planFilter)
    }

    return filtered
  }, [areaFilter, categoryFilter, planFilter, products, searchTerm, statusFilter])

  const openEditDialog = (product: AdminMarketplaceItem) => {
    setCurrentProduct({ ...product })
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    setCurrentProduct(createEmptyProduct())
    setIsDialogOpen(true)
  }

  const saveProduct = async () => {
    if (!currentProduct) return

    const isNewProduct = !products.some((product) => product.id === currentProduct.id)
    const endpoint = isNewProduct ? "/api/admin/marketplace" : `/api/admin/marketplace/${currentProduct.id}`
    const method = isNewProduct ? "POST" : "PATCH"

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(currentProduct),
    })

    if (!response.ok) {
      return
    }

    const savedProduct = (await response.json()) as AdminMarketplaceItem

    setProducts((currentProducts) =>
      isNewProduct
        ? [...currentProducts, savedProduct]
        : currentProducts.map((product) => (product.id === savedProduct.id ? savedProduct : product)),
    )
    setCurrentProduct(savedProduct)
    setIsDialogOpen(false)
  }

  const deleteProduct = async () => {
    if (!productToDelete) return

    const response = await fetch(`/api/admin/marketplace/${productToDelete.id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      return
    }

    setProducts((currentProducts) => currentProducts.filter((product) => product.id !== productToDelete.id))
    setProductToDelete(null)
  }

  const toggleVisibility = async (id: string, field: "showInstitutional" | "showDashboard") => {
    const existingProduct = products.find((product) => product.id === id)

    if (!existingProduct) return

    const nextProduct = { ...existingProduct, [field]: !existingProduct[field] }
    const response = await fetch(`/api/admin/marketplace/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nextProduct),
    })

    if (!response.ok) {
      return
    }

    const savedProduct = (await response.json()) as AdminMarketplaceItem
    setProducts((currentProducts) => currentProducts.map((product) => (product.id === id ? savedProduct : product)))
  }

  const showStats = (product: AdminMarketplaceItem) => {
    setCurrentStats(product)
    setIsStatsDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos..."
              className="pl-8"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorias</SelectItem>
              <SelectItem value="integration">Integracao Externa</SelectItem>
              <SelectItem value="template">Template Inteligente</SelectItem>
              <SelectItem value="service">Servico Personalizado</SelectItem>
              <SelectItem value="capacity">Capacidade Extra</SelectItem>
              <SelectItem value="plan">Plano / Upgrade</SelectItem>
            </SelectContent>
          </Select>
          <Select value={areaFilter} onValueChange={setAreaFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas areas</SelectItem>
              <SelectItem value="atendimento">Atendimento</SelectItem>
              <SelectItem value="agendamento">Agendamento</SelectItem>
              <SelectItem value="vendas">Vendas</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="all-areas">Todas</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="coming-soon">Em breve</SelectItem>
              <SelectItem value="hidden">Oculto</SelectItem>
            </SelectContent>
          </Select>
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Plano minimo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos planos</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="basic">Basico</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={openCreateDialog} className="flex-shrink-0">
          <Plus className="mr-2 h-4 w-4" /> Novo Produto
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Produto</TableHead>
              <TableHead className="hidden md:table-cell">Categoria</TableHead>
              <TableHead className="hidden md:table-cell">Area</TableHead>
              <TableHead className="hidden md:table-cell">Plano Min.</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Acao Cliente</TableHead>
              <TableHead className="hidden lg:table-cell">Institucional</TableHead>
              <TableHead className="hidden lg:table-cell">Dashboard</TableHead>
              <TableHead className="hidden lg:table-cell">Metricas</TableHead>
              <TableHead>Acoes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="py-8 text-center text-muted-foreground">
                  Nenhum produto encontrado com os filtros selecionados.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{getCategoryLabel(product.category)}</TableCell>
                  <TableCell className="hidden md:table-cell">{getAreaLabel(product.relatedArea)}</TableCell>
                  <TableCell className="hidden md:table-cell">{getPlanLabel(product.minPlan)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(product.status)}>{getStatusLabel(product.status)}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{product.clientAction}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {product.showInstitutional ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {product.showDashboard ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Button variant="ghost" size="sm" onClick={() => showStats(product)}>
                      <BarChart2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toggleVisibility(product.id, "showDashboard")}>
                        {product.showDashboard ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setProductToDelete(product)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentProduct && products.some((product) => product.id === currentProduct.id) ? "Editar Produto" : "Novo Produto"}</DialogTitle>
            <DialogDescription>
              {currentProduct && products.some((product) => product.id === currentProduct.id)
                ? "Edite as informacoes do produto do marketplace."
                : "Adicione um novo produto ao marketplace."}
            </DialogDescription>
          </DialogHeader>
          {currentProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Produto</Label>
                  <Input
                    id="name"
                    value={currentProduct.name}
                    onChange={(event) => setCurrentProduct({ ...currentProduct, name: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={currentProduct.category}
                    onValueChange={(value) =>
                      setCurrentProduct({
                        ...currentProduct,
                        category: value,
                        type: value === "integration" ? "integration" : value,
                        categories: Array.from(new Set([value, ...currentProduct.categories.filter((item) => item !== currentProduct.category)])),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="integration">Integracao Externa</SelectItem>
                      <SelectItem value="template">Template Inteligente</SelectItem>
                      <SelectItem value="service">Servico Personalizado</SelectItem>
                      <SelectItem value="capacity">Capacidade Extra</SelectItem>
                      <SelectItem value="plan">Plano / Upgrade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descricao Curta</Label>
                <Input
                  id="description"
                  value={currentProduct.description}
                  onChange={(event) => setCurrentProduct({ ...currentProduct, description: event.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullDescription">Descricao Completa</Label>
                <Textarea
                  id="fullDescription"
                  rows={4}
                  value={currentProduct.fullDescription}
                  onChange={(event) => setCurrentProduct({ ...currentProduct, fullDescription: event.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="relatedArea">Area Relacionada</Label>
                  <Select
                    value={currentProduct.relatedArea}
                    onValueChange={(value) => setCurrentProduct({ ...currentProduct, relatedArea: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="atendimento">Atendimento</SelectItem>
                      <SelectItem value="agendamento">Agendamento</SelectItem>
                      <SelectItem value="vendas">Vendas</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="all-areas">Todas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minPlan">Plano Minimo</Label>
                  <Select
                    value={currentProduct.minPlan}
                    onValueChange={(value) => setCurrentProduct({ ...currentProduct, minPlan: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o plano" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="basic">Basico</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={currentProduct.status}
                    onValueChange={(value) =>
                      setCurrentProduct({
                        ...currentProduct,
                        status: value,
                        displayStatus: value === "coming-soon" ? "coming-soon" : currentProduct.displayStatus,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="coming-soon">Em breve</SelectItem>
                      <SelectItem value="hidden">Oculto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientAction">Botao de Acao do Cliente</Label>
                  <Input
                    id="clientAction"
                    value={currentProduct.clientAction}
                    onChange={(event) => setCurrentProduct({ ...currentProduct, clientAction: event.target.value })}
                    placeholder="Ex: Ativar, Contratar, Ver mais..."
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showInstitutional"
                    checked={currentProduct.showInstitutional}
                    onCheckedChange={(checked) => setCurrentProduct({ ...currentProduct, showInstitutional: !!checked })}
                  />
                  <Label htmlFor="showInstitutional">Mostrar no site institucional</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showDashboard"
                    checked={currentProduct.showDashboard}
                    onCheckedChange={(checked) => setCurrentProduct({ ...currentProduct, showDashboard: !!checked })}
                  />
                  <Label htmlFor="showDashboard">Mostrar no dashboard do cliente</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => void saveProduct()}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isStatsDialogOpen} onOpenChange={setIsStatsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Estatisticas do Produto</DialogTitle>
            <DialogDescription>Metricas de desempenho para: {currentStats?.name}</DialogDescription>
          </DialogHeader>
          {currentStats && (
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Visao Geral</TabsTrigger>
                <TabsTrigger value="details">Detalhes</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Visualizacoes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{currentStats.views}</div>
                      <p className="text-xs text-muted-foreground">
                        +{Math.floor(Math.random() * 20)}% em relacao ao mes anterior
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Cliques</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{currentStats.clicks}</div>
                      <p className="text-xs text-muted-foreground">
                        Taxa de conversao: {Math.floor((currentStats.clicks / Math.max(currentStats.views, 1)) * 100)}%
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Ativacoes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{currentStats.activations}</div>
                      <p className="text-xs text-muted-foreground">
                        Ultimo acesso:{" "}
                        {currentStats.lastAccess ? new Date(currentStats.lastAccess).toLocaleDateString() : "Nunca"}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Historico de Uso</CardTitle>
                    <CardDescription>Detalhes de uso e ativacoes do produto ao longo do tempo.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total de visualizacoes</span>
                        <span className="font-bold">{currentStats.views}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total de cliques</span>
                        <span className="font-bold">{currentStats.clicks}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total de ativacoes</span>
                        <span className="font-bold">{currentStats.activations}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Taxa de conversao</span>
                        <span className="font-bold">
                          {Math.floor((currentStats.clicks / Math.max(currentStats.views, 1)) * 100)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Ultimo acesso</span>
                        <span className="font-bold">
                          {currentStats.lastAccess ? new Date(currentStats.lastAccess).toLocaleDateString() : "Nunca"}
                        </span>
                      </div>
                    </div>
                    <div className="pt-4">
                      <h4 className="mb-2 text-sm font-medium">Usuarios que ativaram</h4>
                      {currentStats.activations > 0 ? (
                        <div className="space-y-2">
                          {Array.from({ length: Math.min(currentStats.activations, 5) }).map((_, index) => (
                            <div key={index} className="flex items-center justify-between rounded-md border p-2">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-primary/20" />
                                <div>
                                  <p className="text-sm font-medium">Usuario {index + 1}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Ativado em: {new Date(Date.now() - index * 86400000).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="outline">Ativo</Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Nenhum usuario ativou este produto ainda.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir produto</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir <strong>{productToDelete?.name}</strong>? Essa acao remove o produto desta
              gestao administrativa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void deleteProduct()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function getCategoryLabel(category: string) {
  const categories: Record<string, string> = {
    integration: "Integracao Externa",
    template: "Template Inteligente",
    service: "Servico Personalizado",
    capacity: "Capacidade Extra",
    plan: "Plano / Upgrade",
  }
  return categories[category] || category
}

function getAreaLabel(area: string) {
  const areas: Record<string, string> = {
    atendimento: "Atendimento",
    agendamento: "Agendamento",
    vendas: "Vendas",
    marketing: "Marketing",
    "all-areas": "Todas",
  }
  return areas[area] || area
}

function getPlanLabel(plan: string) {
  const plans: Record<string, string> = {
    free: "Free",
    basic: "Basico",
    pro: "Pro",
    enterprise: "Enterprise",
  }
  return plans[plan] || plan
}

function getStatusLabel(status: string) {
  const statuses: Record<string, string> = {
    active: "Ativo",
    "coming-soon": "Em breve",
    hidden: "Oculto",
  }
  return statuses[status] || status
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    active: "default",
    "coming-soon": "secondary",
    hidden: "outline",
  }
  return variants[status] || "default"
}
