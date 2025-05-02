"use client"

import { useState } from "react"
import { Copy, Edit, Eye, Filter, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
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

// Dados dos modelos e templates (simulados)
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
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("todas")

  // Filtra os templates com base na categoria e termo de pesquisa
  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = categoryFilter === "todas" || template.category === categoryFilter
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Função para renderizar o badge de categoria
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

  // Função para renderizar o badge de tipo
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar templates..."
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
            <Plus className="h-4 w-4 mr-2" />
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
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Visualizar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          <span>Duplicar</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
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

      <div className="flex justify-between items-center px-4 py-2">
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
  )
}
