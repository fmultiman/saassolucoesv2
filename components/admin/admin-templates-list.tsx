"use client"

import { useState } from "react"
import { Copy, Edit, Eye, Filter, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const templates = [
  {
    id: "tmp-001",
    name: "Relatório Financeiro Mensal",
    category: "relatorios",
    type: "excel",
    lastUpdated: "2023-11-15",
    author: "Admin",
    usage: 87,
  },
  {
    id: "tmp-002",
    name: "Dashboard de Vendas",
    category: "dashboards",
    type: "powerbi",
    lastUpdated: "2023-11-12",
    author: "Admin",
    usage: 65,
  },
  {
    id: "tmp-003",
    name: "Email de Boas-vindas",
    category: "emails",
    type: "html",
    lastUpdated: "2023-11-10",
    author: "Marketing",
    usage: 92,
  },
  {
    id: "tmp-004",
    name: "Análise de Desempenho",
    category: "relatorios",
    type: "pdf",
    lastUpdated: "2023-11-08",
    author: "RH",
    usage: 45,
  },
  {
    id: "tmp-005",
    name: "Proposta Comercial",
    category: "documentos",
    type: "word",
    lastUpdated: "2023-11-05",
    author: "Vendas",
    usage: 78,
  },
  {
    id: "tmp-006",
    name: "Newsletter Mensal",
    category: "emails",
    type: "html",
    lastUpdated: "2023-11-03",
    author: "Marketing",
    usage: 56,
  },
  {
    id: "tmp-007",
    name: "Controle de Estoque",
    category: "dashboards",
    type: "powerbi",
    lastUpdated: "2023-10-30",
    author: "Operações",
    usage: 42,
  },
  {
    id: "tmp-008",
    name: "Contrato de Serviço",
    category: "documentos",
    type: "pdf",
    lastUpdated: "2023-10-28",
    author: "Jurídico",
    usage: 34,
  },
]

export function AdminTemplatesList() {
  const [templateItems, setTemplateItems] = useState(templates)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("todas")
  const [selectedTemplate, setSelectedTemplate] = useState<(typeof templates)[number] | null>(null)
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "duplicate" | null>(null)
  const [templateToDelete, setTemplateToDelete] = useState<(typeof templates)[number] | null>(null)
  const [openMenuTemplateId, setOpenMenuTemplateId] = useState<string | null>(null)
  const [formValues, setFormValues] = useState({
    name: "",
    category: "relatorios",
    type: "pdf",
    author: "",
  })

  const filteredTemplates = templateItems.filter((template) => {
    const matchesCategory = categoryFilter === "todas" || template.category === categoryFilter
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const renderCategoryBadge = (category: string) => {
    const categoryMap: Record<string, { label: string; color: string }> = {
      relatorios: { label: "Relatórios", color: "bg-blue-500 hover:bg-blue-600" },
      dashboards: { label: "Dashboards", color: "bg-green-500 hover:bg-green-600" },
      emails: { label: "Emails", color: "bg-purple-500 hover:bg-purple-600" },
      documentos: { label: "Documentos", color: "bg-orange-500 hover:bg-orange-600" },
    }

    const categoryInfo = categoryMap[category] || { label: category, color: "bg-gray-500 hover:bg-gray-600" }
    return <Badge className={categoryInfo.color}>{categoryInfo.label}</Badge>
  }

  const renderTypeBadge = (type: string) => {
    const typeMap: Record<string, { color: string }> = {
      excel: { color: "bg-green-500/10 text-green-500" },
      powerbi: { color: "bg-yellow-500/10 text-yellow-500" },
      html: { color: "bg-blue-500/10 text-blue-500" },
      pdf: { color: "bg-red-500/10 text-red-500" },
      word: { color: "bg-indigo-500/10 text-indigo-500" },
    }

    const typeInfo = typeMap[type] || { color: "bg-gray-500/10 text-gray-500" }

    return (
      <Badge variant="outline" className={typeInfo.color}>
        {type.toUpperCase()}
      </Badge>
    )
  }

  const openDialog = (mode: "view" | "edit" | "duplicate", template: (typeof templates)[number]) => {
    setOpenMenuTemplateId(null)
    setSelectedTemplate(template)
    setFormValues({
      name: mode === "duplicate" ? `${template.name} - Cópia` : template.name,
      category: template.category,
      type: template.type,
      author: template.author,
    })
    window.setTimeout(() => setDialogMode(mode), 0)
  }

  const handleDeleteTemplate = () => {
    if (!templateToDelete) return
    setTemplateItems((current) => current.filter((template) => template.id !== templateToDelete.id))
    setTemplateToDelete(null)
  }

  const handleSaveTemplate = () => {
    if (!selectedTemplate || !dialogMode) return

    if (dialogMode === "edit") {
      setTemplateItems((current) =>
        current.map((template) =>
          template.id === selectedTemplate.id
            ? {
                ...template,
                name: formValues.name,
                category: formValues.category,
                type: formValues.type,
                author: formValues.author,
                lastUpdated: new Date().toISOString().slice(0, 10),
              }
            : template,
        ),
      )
    }

    if (dialogMode === "duplicate") {
      setTemplateItems((current) => [
        {
          ...selectedTemplate,
          id: `tmp-${Date.now()}`,
          name: formValues.name,
          category: formValues.category,
          type: formValues.type,
          author: formValues.author,
          lastUpdated: new Date().toISOString().slice(0, 10),
          usage: 0,
        },
        ...current,
      ])
    }

    setDialogMode(null)
    setSelectedTemplate(null)
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col items-start justify-between gap-4 p-4 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar templates..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Select defaultValue="todas" onValueChange={(value) => setCategoryFilter(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as categorias</SelectItem>
                <SelectItem value="relatorios">Relatórios</SelectItem>
                <SelectItem value="dashboards">Dashboards</SelectItem>
                <SelectItem value="emails">Emails</SelectItem>
                <SelectItem value="documentos">Documentos</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Template
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead>Uso</TableHead>
                <TableHead className="w-[80px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.name}</TableCell>
                    <TableCell>{renderCategoryBadge(template.category)}</TableCell>
                    <TableCell>{renderTypeBadge(template.type)}</TableCell>
                    <TableCell>{template.author}</TableCell>
                    <TableCell>{template.lastUpdated}</TableCell>
                    <TableCell>{template.usage} vezes</TableCell>
                    <TableCell>
                      <DropdownMenu
                        open={openMenuTemplateId === template.id}
                        onOpenChange={(open) => setOpenMenuTemplateId(open ? template.id : null)}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem
                            onSelect={() => {
                              openDialog("view", template)
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Visualizar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              openDialog("edit", template)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              openDialog("duplicate", template)
                            }}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            <span>Duplicar</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onSelect={() => {
                              setOpenMenuTemplateId(null)
                              window.setTimeout(() => setTemplateToDelete(template), 0)
                            }}
                          >
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
                  <TableCell colSpan={7} className="h-24 text-center">
                    Nenhum template encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between px-4 py-2">
          <p className="text-sm text-muted-foreground">
            Mostrando {filteredTemplates.length} de {templates.length} templates
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Anterior
            </Button>
            <Button variant="outline" size="sm">
              Próximo
            </Button>
          </div>
        </div>
      </div>

      <Dialog
        open={!!dialogMode && !!selectedTemplate}
        onOpenChange={(open) => {
          if (!open) {
            setDialogMode(null)
            setSelectedTemplate(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-[560px]">
          {dialogMode === "view" && selectedTemplate && (
            <>
              <DialogHeader>
                <DialogTitle>Visualizar template</DialogTitle>
                <DialogDescription>Resumo rápido do material cadastrado.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 py-4 text-sm">
                <div><strong>Nome:</strong> {selectedTemplate.name}</div>
                <div><strong>Categoria:</strong> {selectedTemplate.category}</div>
                <div><strong>Tipo:</strong> {selectedTemplate.type.toUpperCase()}</div>
                <div><strong>Autor:</strong> {selectedTemplate.author}</div>
                <div><strong>Uso:</strong> {selectedTemplate.usage} vezes</div>
              </div>
            </>
          )}

          {dialogMode === "edit" && selectedTemplate && (
            <>
              <DialogHeader>
                <DialogTitle>Editar template</DialogTitle>
                <DialogDescription>Atualize os metadados principais que o admin realmente usa no catálogo.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Nome</label>
                  <Input value={formValues.name} onChange={(event) => setFormValues((current) => ({ ...current, name: event.target.value }))} />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Categoria</label>
                    <Select value={formValues.category} onValueChange={(value) => setFormValues((current) => ({ ...current, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relatorios">Relatórios</SelectItem>
                        <SelectItem value="dashboards">Dashboards</SelectItem>
                        <SelectItem value="emails">Emails</SelectItem>
                        <SelectItem value="documentos">Documentos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Tipo</label>
                    <Select value={formValues.type} onValueChange={(value) => setFormValues((current) => ({ ...current, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="powerbi">Power BI</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="word">Word</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Responsável</label>
                  <Input value={formValues.author} onChange={(event) => setFormValues((current) => ({ ...current, author: event.target.value }))} />
                </div>
              </div>
            </>
          )}

          {dialogMode === "duplicate" && selectedTemplate && (
            <>
              <DialogHeader>
                <DialogTitle>Duplicar template</DialogTitle>
                <DialogDescription>Crie uma nova base já com nome e classificação ajustados.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Nome da cópia</label>
                  <Input value={formValues.name} onChange={(event) => setFormValues((current) => ({ ...current, name: event.target.value }))} />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Categoria</label>
                    <Select value={formValues.category} onValueChange={(value) => setFormValues((current) => ({ ...current, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relatorios">Relatórios</SelectItem>
                        <SelectItem value="dashboards">Dashboards</SelectItem>
                        <SelectItem value="emails">Emails</SelectItem>
                        <SelectItem value="documentos">Documentos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Responsável</label>
                    <Input value={formValues.author} onChange={(event) => setFormValues((current) => ({ ...current, author: event.target.value }))} />
                  </div>
                </div>
              </div>
            </>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogMode(null)
                setSelectedTemplate(null)
              }}
            >
              Fechar
            </Button>
            {dialogMode === "edit" && <Button onClick={handleSaveTemplate}>Salvar alterações</Button>}
            {dialogMode === "duplicate" && <Button onClick={handleSaveTemplate}>Criar cópia</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!templateToDelete} onOpenChange={(open) => !open && setTemplateToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir template</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir <strong>{templateToDelete?.name}</strong>? Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTemplate}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
