"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { MessageSquare, Filter, Search, ArrowRight, Download, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function InteracoesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const interacoes = [
    {
      id: 1,
      cliente: "Maria Silva",
      mensagem: "Gostaria de saber mais sobre o plano premium",
      horario: "Hoje, 14:35",
      avatar: "/placeholder.svg",
      solucao: "Atendente Virtual",
      status: "Respondido",
    },
    {
      id: 2,
      cliente: "João Oliveira",
      mensagem: "Preciso remarcar minha consulta para amanhã",
      horario: "Hoje, 11:20",
      avatar: "/placeholder.svg",
      solucao: "Agendamento Inteligente",
      status: "Em andamento",
    },
    {
      id: 3,
      cliente: "Ana Costa",
      mensagem: "Obrigada pelo excelente atendimento!",
      horario: "Ontem, 16:45",
      avatar: "/placeholder.svg",
      solucao: "Atendente Virtual",
      status: "Concluído",
    },
    {
      id: 4,
      cliente: "Carlos Mendes",
      mensagem: "Quero cancelar minha assinatura",
      horario: "Ontem, 10:15",
      avatar: "/placeholder.svg",
      solucao: "Recuperação de Clientes",
      status: "Transferido",
    },
    {
      id: 5,
      cliente: "Fernanda Lima",
      mensagem: "Como faço para atualizar meus dados de pagamento?",
      horario: "12/04/2023, 09:30",
      avatar: "/placeholder.svg",
      solucao: "Atendente Virtual",
      status: "Respondido",
    },
  ]

  const statusColors = {
    Respondido: "bg-green-500/10 text-green-500",
    "Em andamento": "bg-blue-500/10 text-blue-500",
    Concluído: "bg-purple-500/10 text-purple-500",
    Transferido: "bg-orange-500/10 text-orange-500",
  }

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
                <h1 className="text-3xl font-bold tracking-tight">Interações</h1>
                <p className="text-muted-foreground">Acompanhe todas as interações com seus clientes.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Filtrar por Data
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
                <Button size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar interações..." className="pl-9" />
              </div>
              <Select defaultValue="todas">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Solução" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as Soluções</SelectItem>
                  <SelectItem value="atendente">Atendente Virtual</SelectItem>
                  <SelectItem value="recuperacao">Recuperação de Clientes</SelectItem>
                  <SelectItem value="agendamento">Agendamento Inteligente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs defaultValue="todas">
              <TabsList>
                <TabsTrigger value="todas">Todas</TabsTrigger>
                <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
                <TabsTrigger value="respondidas">Respondidas</TabsTrigger>
                <TabsTrigger value="transferidas">Transferidas</TabsTrigger>
              </TabsList>
              <TabsContent value="todas" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Todas as Interações</CardTitle>
                    <CardDescription>Visualize todas as interações recentes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {interacoes.map((interacao) => (
                        <div
                          key={interacao.id}
                          className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-accent/50"
                        >
                          <div className="h-10 w-10 rounded-full bg-accent/50 overflow-hidden">
                            <img
                              src={interacao.avatar || "/placeholder.svg"}
                              alt={interacao.cliente}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{interacao.cliente}</p>
                              <span className="text-xs text-muted-foreground">{interacao.horario}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{interacao.mensagem}</p>
                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-primary/10 text-primary">
                                  {interacao.solucao}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={statusColors[interacao.status as keyof typeof statusColors]}
                                >
                                  {interacao.status}
                                </Badge>
                              </div>
                              <Button variant="ghost" size="sm">
                                Ver Detalhes
                                <ArrowRight className="ml-1 h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Anterior</Button>
                    <div className="text-sm text-muted-foreground">Página 1 de 3</div>
                    <Button>Próxima</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="pendentes">
                <Card>
                  <CardHeader>
                    <CardTitle>Interações Pendentes</CardTitle>
                    <CardDescription>Interações que precisam de atenção</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                        <h3 className="mt-4 text-lg font-medium">Nenhuma interação pendente</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Todas as interações foram respondidas ou estão em andamento.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="respondidas">
                <Card>
                  <CardHeader>
                    <CardTitle>Interações Respondidas</CardTitle>
                    <CardDescription>Interações que foram respondidas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {interacoes
                        .filter((interacao) => interacao.status === "Respondido" || interacao.status === "Concluído")
                        .map((interacao) => (
                          <div
                            key={interacao.id}
                            className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-accent/50"
                          >
                            <div className="h-10 w-10 rounded-full bg-accent/50 overflow-hidden">
                              <img
                                src={interacao.avatar || "/placeholder.svg"}
                                alt={interacao.cliente}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">{interacao.cliente}</p>
                                <span className="text-xs text-muted-foreground">{interacao.horario}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{interacao.mensagem}</p>
                              <div className="flex items-center justify-between pt-1">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="bg-primary/10 text-primary">
                                    {interacao.solucao}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={statusColors[interacao.status as keyof typeof statusColors]}
                                  >
                                    {interacao.status}
                                  </Badge>
                                </div>
                                <Button variant="ghost" size="sm">
                                  Ver Detalhes
                                  <ArrowRight className="ml-1 h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="transferidas">
                <Card>
                  <CardHeader>
                    <CardTitle>Interações Transferidas</CardTitle>
                    <CardDescription>Interações transferidas para atendimento humano</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {interacoes
                        .filter((interacao) => interacao.status === "Transferido")
                        .map((interacao) => (
                          <div
                            key={interacao.id}
                            className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-accent/50"
                          >
                            <div className="h-10 w-10 rounded-full bg-accent/50 overflow-hidden">
                              <img
                                src={interacao.avatar || "/placeholder.svg"}
                                alt={interacao.cliente}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">{interacao.cliente}</p>
                                <span className="text-xs text-muted-foreground">{interacao.horario}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{interacao.mensagem}</p>
                              <div className="flex items-center justify-between pt-1">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="bg-primary/10 text-primary">
                                    {interacao.solucao}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={statusColors[interacao.status as keyof typeof statusColors]}
                                  >
                                    {interacao.status}
                                  </Badge>
                                </div>
                                <Button variant="ghost" size="sm">
                                  Ver Detalhes
                                  <ArrowRight className="ml-1 h-3 w-3" />
                                </Button>
                              </div>
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
