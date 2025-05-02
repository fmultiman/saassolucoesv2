"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Mail, Edit, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface User {
  id: string
  name: string
  email: string
  status: string
  plan: string
  user_type: string
  created_at: string
  last_sign_in_at?: string
  active_solutions: number
}

interface AdminUsersListProps {
  initialUsers: User[]
}

export function AdminUsersList({ initialUsers }: AdminUsersListProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)

  // Função para formatar a data da última atividade
  const formatLastActivity = (date?: string) => {
    if (!date) return "Nunca"

    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: ptBR,
      })
    } catch (error) {
      console.error("Erro ao formatar data:", error)
      return "Data inválida"
    }
  }

  // Função para obter a cor do badge de status
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success"
      case "inactive":
        return "secondary"
      case "suspended":
        return "destructive"
      case "pending":
        return "warning"
      default:
        return "default"
    }
  }

  // Função para traduzir o status
  const translateStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "Ativo"
      case "inactive":
        return "Inativo"
      case "suspended":
        return "Suspenso"
      case "pending":
        return "Pendente"
      default:
        return status
    }
  }

  // Função para traduzir o plano
  const translatePlan = (plan: string) => {
    switch (plan.toLowerCase()) {
      case "free":
        return "Gratuito"
      case "basic":
        return "Básico"
      case "pro":
        return "Pro"
      case "enterprise":
        return "Enterprise"
      default:
        return plan
    }
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuário</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Plano</TableHead>
            <TableHead className="hidden md:table-cell">Soluções Ativas</TableHead>
            <TableHead className="hidden md:table-cell">Última Atividade</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Nenhum usuário encontrado
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                    <span className="text-xs text-muted-foreground md:hidden">
                      {translatePlan(user.plan)} • {user.active_solutions} soluções
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(user.status) as any}>{translateStatus(user.status)}</Badge>
                </TableCell>
                <TableCell>{translatePlan(user.plan)}</TableCell>
                <TableCell className="hidden md:table-cell">{user.active_solutions}</TableCell>
                <TableCell className="hidden md:table-cell">{formatLastActivity(user.last_sign_in_at)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        Reenviar e-mail de acesso
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar usuário
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir usuário
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
