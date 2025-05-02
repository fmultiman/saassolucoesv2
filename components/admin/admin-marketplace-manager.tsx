"use client"

import { useState } from "react"
import { Plus, Search, Eye, EyeOff, Edit, Trash2, BarChart2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { marketplaceProducts } from "./admin-marketplace-data"

export function AdminMarketplaceManager() {
  const [products, setProducts] = useState(marketplaceProducts)
  const [filteredProducts, setFilteredProducts] = useState(marketplaceProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [areaFilter, setAreaFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<any>(null)
  const [isStatsDialogOpen, setIsStatsDialogOpen] = useState(false)
  const [currentStats, setCurrentStats] = useState<any>(null)

  // Função para filtrar produtos
  const filterProducts = () => {
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

    setFilteredProducts(filtered)
  }

  // Função para abrir o modal de edição
  const openEditDialog = (product: any) => {
    setCurrentProduct({ ...product })
    setIsDialogOpen(true)
  }

  // Função para abrir o modal de criação
  const openCreateDialog = () => {
    setCurrentProduct({
      id: Date.now().toString(),
      name: "",
      description: "",
      fullDescription: "",
      category: "",
      relatedArea: "",
      minPlan: "free",
      status: "active",
      clientAction: "",
      showInstitutional: true,
      showDashboard: true,
      views: 0,
      clicks: 0,
      activations: 0,
      lastAccess: null,
    })
    setIsDialogOpen(true)
  }

  // Função para salvar produto (criar ou editar)
  const saveProduct = () => {
    if (!currentProduct) return

    const isNewProduct = !products.find((p) => p.id === currentProduct.id)

    if (isNewProduct) {
      setProducts([...products, currentProduct])
    } else {
      setProducts(products.map((p) => (p.id === currentProduct.id ? currentProduct : p)))
    }

    setIsDialogOpen(false)
    filterProducts()
  }

  // Função para excluir produto
  const deleteProduct = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      setProducts(products.filter((p) => p.id !== id))
      setFilteredProducts(filteredProducts.filter((p) => p.id !== id))
    }
  }

  // Função para alternar visibilidade
  const toggleVisibility = (id: string, field: "showInstitutional" | "showDashboard") => {
    setProducts(
      products.map((p) => {
        if (p.id === id) {
          return { ...p, [field]: !p[field] }
        }
        return p
      }),
    )

    setFilteredProducts(
      filteredProducts.map((p) => {
        if (p.id === id) {
          return { ...p, [field]: !p[field] }
        }
        return p
      }),
    )
  }

  // Função para mostrar estatísticas
  const showStats = (product: any) => {
    setCurrentStats(product)
    setIsStatsDialogOpen(true)
  }

  // Aplicar filtros quando os valores mudarem
  const applyFilters = () => {
    filterProducts()
  }

  return (
    <div className="space-y-4">
      {/* Filtros e botão de novo produto */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setTimeout(applyFilters, 300)
              }}
            />
          </div>
          <Select
            value={categoryFilter}
            onValueChange={(value) => {
              setCategoryFilter(value)
              setTimeout(applyFilters, 100)
            }}
          >
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorias</SelectItem>
              <SelectItem value="integration">Integração Externa</SelectItem>
              <SelectItem value="template">Template Inteligente</SelectItem>
              <SelectItem value="service">Serviço Personalizado</SelectItem>
              <SelectItem value="capacity">Capacidade Extra</SelectItem>
              <SelectItem value="plan">Plano / Upgrade</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={areaFilter}
            onValueChange={(value) => {
              setAreaFilter(value)
              setTimeout(applyFilters, 100)
            }}
          >
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Área" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas áreas</SelectItem>
              <SelectItem value="atendimento">Atendimento</SelectItem>
              <SelectItem value="agendamento">Agendamento</SelectItem>
              <SelectItem value="vendas">Vendas</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="all-areas">Todas</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value)
              setTimeout(applyFilters, 100)
            }}
          >
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
          <Select
            value={planFilter}
            onValueChange={(value) => {
              setPlanFilter(value)
              setTimeout(applyFilters, 100)
            }}
          >
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Plano mínimo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos planos</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="basic">Básico</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={openCreateDialog} className="flex-shrink-0">
          <Plus className="mr-2 h-4 w-4" /> Novo Produto
        </Button>
      </div>

      {/* Tabela de produtos */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Produto</TableHead>
              <TableHead className="hidden md:table-cell">Categoria</TableHead>
              <TableHead className="hidden md:table-cell">Área</TableHead>
              <TableHead className="hidden md:table-cell">Plano Mín.</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Ação Cliente</TableHead>
              <TableHead className="hidden lg:table-cell">Institucional</TableHead>
              <TableHead className="hidden lg:table-cell">Dashboard</TableHead>
              <TableHead className="hidden lg:table-cell">Métricas</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
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
                      <Button variant="ghost" size="sm" onClick={() => deleteProduct(product.id)}>
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

      {/* Modal de edição/criação */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentProduct?.id ? "Editar Produto" : "Novo Produto"}</DialogTitle>
            <DialogDescription>
              {currentProduct?.id
                ? "Edite as informações do produto do marketplace."
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
                    onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={currentProduct.category}
                    onValueChange={(value) => setCurrentProduct({ ...currentProduct, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="integration">Integração Externa</SelectItem>
                      <SelectItem value="template">Template Inteligente</SelectItem>
                      <SelectItem value="service">Serviço Personalizado</SelectItem>
                      <SelectItem value="capacity">Capacidade Extra</SelectItem>
                      <SelectItem value="plan">Plano / Upgrade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição Curta</Label>
                <Input
                  id="description"
                  value={currentProduct.description}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullDescription">Descrição Completa</Label>
                <Textarea
                  id="fullDescription"
                  rows={4}
                  value={currentProduct.fullDescription}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, fullDescription: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="relatedArea">Área Relacionada</Label>
                  <Select
                    value={currentProduct.relatedArea}
                    onValueChange={(value) => setCurrentProduct({ ...currentProduct, relatedArea: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a área" />
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
                  <Label htmlFor="minPlan">Plano Mínimo</Label>
                  <Select
                    value={currentProduct.minPlan}
                    onValueChange={(value) => setCurrentProduct({ ...currentProduct, minPlan: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o plano" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="basic">Básico</SelectItem>
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
                    onValueChange={(value) => setCurrentProduct({ ...currentProduct, status: value })}
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
                  <Label htmlFor="clientAction">Botão de Ação do Cliente</Label>
                  <Input
                    id="clientAction"
                    value={currentProduct.clientAction}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, clientAction: e.target.value })}
                    placeholder="Ex: Ativar, Contratar, Ver mais..."
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showInstitutional"
                    checked={currentProduct.showInstitutional}
                    onCheckedChange={(checked) =>
                      setCurrentProduct({ ...currentProduct, showInstitutional: !!checked })
                    }
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
            <Button onClick={saveProduct}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de estatísticas */}
      <Dialog open={isStatsDialogOpen} onOpenChange={setIsStatsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Estatísticas do Produto</DialogTitle>
            <DialogDescription>Métricas de desempenho para: {currentStats?.name}</DialogDescription>
          </DialogHeader>
          {currentStats && (
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="details">Detalhes</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{currentStats.views}</div>
                      <p className="text-xs text-muted-foreground">
                        +{Math.floor(Math.random() * 20)}% em relação ao mês anterior
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
                        Taxa de conversão: {Math.floor((currentStats.clicks / Math.max(currentStats.views, 1)) * 100)}%
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Ativações</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{currentStats.activations}</div>
                      <p className="text-xs text-muted-foreground">
                        Último acesso:{" "}
                        {currentStats.lastAccess ? new Date(currentStats.lastAccess).toLocaleDateString() : "Nunca"}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Histórico de Uso</CardTitle>
                    <CardDescription>Detalhes de uso e ativações do produto ao longo do tempo.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total de visualizações</span>
                        <span className="font-bold">{currentStats.views}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total de cliques</span>
                        <span className="font-bold">{currentStats.clicks}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total de ativações</span>
                        <span className="font-bold">{currentStats.activations}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Taxa de conversão</span>
                        <span className="font-bold">
                          {Math.floor((currentStats.clicks / Math.max(currentStats.views, 1)) * 100)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Último acesso</span>
                        <span className="font-bold">
                          {currentStats.lastAccess ? new Date(currentStats.lastAccess).toLocaleDateString() : "Nunca"}
                        </span>
                      </div>
                    </div>
                    <div className="pt-4">
                      <h4 className="mb-2 text-sm font-medium">Usuários que ativaram</h4>
                      {currentStats.activations > 0 ? (
                        <div className="space-y-2">
                          {Array.from({ length: Math.min(currentStats.activations, 5) }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between rounded-md border p-2">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-primary/20" />
                                <div>
                                  <p className="text-sm font-medium">Usuário {i + 1}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Ativado em: {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="outline">Ativo</Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Nenhum usuário ativou este produto ainda.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Funções auxiliares para obter labels
function getCategoryLabel(category: string) {
  const categories: Record<string, string> = {
    integration: "Integração Externa",
    template: "Template Inteligente",
    service: "Serviço Personalizado",
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
    basic: "Básico",
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
