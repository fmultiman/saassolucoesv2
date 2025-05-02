"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import {
  Bot,
  Users,
  Edit,
  BarChart,
  Trash2,
  Plus,
  Clock,
  Filter,
  Search,
  Download,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function MinhasSolucoesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const solucoes = [
    {
      id: 1,
      nome: "Atendente Virtual",
      descricao: "Automatize o atendimento inicial com IA",
      categoria: "atendimento",
      icone: Bot,
      cor: "bg-blue-500/10 text-blue-500",
      status: "ativo",
      estatisticas: {
        interacoes: 487,
        tempoEconomizado: "12h",
        taxaResolucao: "78%",
      },
    },
    {
      id: 2,
      nome: "Recuperação de Clientes",
      descricao: "Reative clientes inativos com mensagens personalizadas",
      categoria: "vendas",
      icone: Users,
      cor: "bg-green-500/10 text-green-500",
      status: "ativo",
      estatisticas: {
        interacoes: 156,
        conversoes: "23",
        taxaEngajamento: "34%",
      },
    },
  ]

  const historicoSolucoes = [
    {
      id: 3,
      nome: "Análise de Sentimento",
      descricao: "Entenda o sentimento dos clientes em tempo real",
      categoria: "feedback",
      icone: BarChart,
      cor: "bg-orange-500/10 text-orange-500",
      status: "inativo",
      dataDesativacao: "12/03/2023",
      motivo: "Substituído por outra solução",
    },
    {
      id: 4,
      nome: "Agendamento Inteligente",
      descricao: "Otimize sua agenda com sugestões baseadas em IA",
      categoria: "agendamento",
      icone: Clock,
      cor: "bg-purple-500/10 text-purple-500",
      status: "inativo",
      dataDesativacao: "05/02/2023",
      motivo: "Período de teste finalizado",
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${sidebarCollapsed ? "md:ml-[70px]" : "md:ml-64"}`}
      >
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Minhas Soluções</h1>
                <p className="text-muted-foreground">Gerencie e configure suas soluções ativas.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Solução
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar soluções..." className="pl-9" />
              </div>
              <Select defaultValue="todas">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as categorias</SelectItem>
                  <SelectItem value="atendimento">Atendimento</SelectItem>
                  <SelectItem value="vendas">Vendas</SelectItem>
                  <SelectItem value="agendamento">Agendamento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs defaultValue="ativas">
              <TabsList>
                <TabsTrigger value="ativas">Soluções Ativas</TabsTrigger>
                <TabsTrigger value="historico">Histórico</TabsTrigger>
              </TabsList>
              <TabsContent value="ativas" className="space-y-4">
                {solucoes.map((solucao) => (
                  <Card key={solucao.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`rounded-md p-2 ${solucao.cor}`}>
                            <solucao.icone className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle>{solucao.nome}</CardTitle>
                            <CardDescription>{solucao.descricao}</CardDescription>
                          </div>
                        </div>
                        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                          Ativo
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 md:grid-cols-3">
                        {solucao.id === 1 ? (
                          <>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Interações</p>
                              <p className="text-2xl font-bold">{solucao.estatisticas.interacoes}</p>
                              <p className="text-xs text-muted-foreground">+12% vs. mês anterior</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Tempo Economizado</p>
                              <p className="text-2xl font-bold">{solucao.estatisticas.tempoEconomizado}</p>
                              <p className="text-xs text-muted-foreground">~2h por dia</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Taxa de Resolução</p>
                              <p className="text-2xl font-bold">{solucao.estatisticas.taxaResolucao}</p>
                              <p className="text-xs text-muted-foreground">+5% vs. mês anterior</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Interações</p>
                              <p className="text-2xl font-bold">{solucao.estatisticas.interacoes}</p>
                              <p className="text-xs text-muted-foreground">+8% vs. mês anterior</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Conversões</p>
                              <p className="text-2xl font-bold">{solucao.estatisticas.conversoes}</p>
                              <p className="text-xs text-muted-foreground">+3 vs. mês anterior</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Taxa de Engajamento</p>
                              <p className="text-2xl font-bold">{solucao.estatisticas.taxaEngajamento}</p>
                              <p className="text-xs text-muted-foreground">+2% vs. mês anterior</p>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`status-${solucao.id}`}>Status:</Label>
                        <Switch id={`status-${solucao.id}`} defaultChecked />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          Relatório
                        </Button>
                        <Button variant="outline">
                          <Edit className="mr-2 h-4 w-4" />
                          Configurar
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="historico" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Histórico de Soluções</CardTitle>
                    <CardDescription>Soluções que foram desativadas anteriormente</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {historicoSolucoes.map((solucao) => (
                        <div
                          key={solucao.id}
                          className="flex items-start justify-between gap-4 rounded-lg border p-4 transition-colors hover:bg-accent/50"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`rounded-md p-2 ${solucao.cor}`}>
                              <solucao.icone className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">{solucao.nome}</p>
                              <p className="text-sm text-muted-foreground">{solucao.descricao}</p>
                              <div className="mt-1 flex items-center gap-2">
                                <Badge variant="outline" className="bg-red-500/10 text-red-500">
                                  <XCircle className="mr-1 h-3 w-3" />
                                  Desativado
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {solucao.dataDesativacao} • {solucao.motivo}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Reativar
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
