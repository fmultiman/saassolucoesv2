"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Calendar, Filter, Search, Download, CheckCircle, AlertCircle, PauseCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type EnvioStatus = "Agendado" | "Em Pausa" | "Cancelado"

export default function ProximosEnviosPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const envios = [
    {
      id: 1,
      titulo: "Lembrete de Consulta",
      descricao: "Lembrete automático para consultas agendadas",
      horario: "Hoje, 18:00",
      solucao: "Agendamento Inteligente",
      status: "Agendado" as EnvioStatus,
      destinatarios: 12,
    },
    {
      id: 2,
      titulo: "Recuperação de Carrinho",
      descricao: "Mensagem para clientes com carrinho abandonado",
      horario: "Amanhã, 10:00",
      solucao: "Recuperação de Clientes",
      status: "Agendado" as EnvioStatus,
      destinatarios: 34,
    },
    {
      id: 3,
      titulo: "Pesquisa de Satisfação",
      descricao: "Pesquisa pós-atendimento",
      horario: "Amanhã, 14:30",
      solucao: "Feedback",
      status: "Agendado" as EnvioStatus,
      destinatarios: 56,
    },
    {
      id: 4,
      titulo: "Aniversário de Cliente",
      descricao: "Mensagem de felicitações e cupom de desconto",
      horario: "15/04/2023, 08:00",
      solucao: "Relacionamento",
      status: "Agendado" as EnvioStatus,
      destinatarios: 7,
    },
    {
      id: 5,
      titulo: "Reativação de Clientes",
      descricao: "Campanha para clientes inativos há mais de 30 dias",
      horario: "16/04/2023, 09:00",
      solucao: "Recuperação de Clientes",
      status: "Em Pausa" as EnvioStatus,
      destinatarios: 128,
    },
  ]

  const statusColors: Record<EnvioStatus, string> = {
    Agendado: "bg-green-500/10 text-green-500",
    "Em Pausa": "bg-orange-500/10 text-orange-500",
    Cancelado: "bg-red-500/10 text-red-500",
  }

  const statusIcons: Record<EnvioStatus, typeof CheckCircle> = {
    Agendado: CheckCircle,
    "Em Pausa": PauseCircle,
    Cancelado: AlertCircle,
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
                <h1 className="text-3xl font-bold tracking-tight">Próximos Envios</h1>
                <p className="text-muted-foreground">Gerencie os envios programados das suas soluções.</p>
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
                <Input placeholder="Buscar envios..." className="pl-9" />
              </div>
              <Select defaultValue="todas">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todos os status</SelectItem>
                  <SelectItem value="agendado">Agendado</SelectItem>
                  <SelectItem value="pausa">Em Pausa</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader className="px-6 py-4">
                <CardTitle>Envios Programados</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead className="hidden md:table-cell">Descrição</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead className="hidden md:table-cell">Solução</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Destinatários</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {envios.map((envio) => {
                      const StatusIcon = statusIcons[envio.status]
                      return (
                        <TableRow key={envio.id}>
                          <TableCell className="font-medium">{envio.titulo}</TableCell>
                          <TableCell className="hidden md:table-cell">{envio.descricao}</TableCell>
                          <TableCell>{envio.horario}</TableCell>
                          <TableCell className="hidden md:table-cell">{envio.solucao}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span
                                className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${statusColors[envio.status]}`}
                              >
                                <StatusIcon className="h-3 w-3" />
                                {envio.status}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{envio.destinatarios}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Editar
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
