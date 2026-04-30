"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Edit, Mail, MoreHorizontal, Trash2 } from "lucide-react"
import { EditUserModal } from "@/components/admin/edit-user-modal"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"

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
  const router = useRouter()
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [openMenuUserId, setOpenMenuUserId] = useState<string | null>(null)
  const { toast } = useToast()

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

  const translatePlan = (plan: string) => {
    switch (plan.toLowerCase()) {
      case "free":
      case "gratuito":
        return "Gratuito"
      case "basic":
      case "essencial":
        return "Essencial"
      case "pro":
      case "profissional":
        return "Profissional"
      case "enterprise":
      case "completo":
        return "Completo"
      default:
        return plan
    }
  }

  const handleUserUpdated = (updatedUser: Partial<User> & { id: string }) => {
    setUsers((current) =>
      current.map((user) => (user.id === updatedUser.id ? { ...user, ...updatedUser } : user)),
    )
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return

    try {
      setIsDeleting(true)

      const response = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: "DELETE",
      })

      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(payload?.error || `Erro ao excluir usuário: ${response.status}`)
      }

      setUsers((current) => current.filter((user) => user.id !== userToDelete.id))
      router.refresh()
      toast({
        title: "Usuário excluído",
        description: `${userToDelete.name} foi removido com sucesso.`,
      })
      setUserToDelete(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível excluir o usuário."
      console.error("Erro ao excluir usuário:", error)
      toast({
        title: "Erro ao excluir usuário",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="overflow-x-auto rounded-md border">
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
                <TableCell colSpan={6} className="py-8 text-center">
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
                    <Badge variant={getStatusBadgeVariant(user.status) as never}>{translateStatus(user.status)}</Badge>
                  </TableCell>
                  <TableCell>{translatePlan(user.plan)}</TableCell>
                  <TableCell className="hidden md:table-cell">{user.active_solutions}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatLastActivity(user.last_sign_in_at)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu
                      open={openMenuUserId === user.id}
                      onOpenChange={(open) => setOpenMenuUserId(open ? user.id : null)}
                    >
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
                        <DropdownMenuItem
                          onSelect={() => {
                            setOpenMenuUserId(null)
                            window.setTimeout(() => setEditingUser(user), 0)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar usuário
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onSelect={() => {
                            setOpenMenuUserId(null)
                            window.setTimeout(() => setUserToDelete(user), 0)
                          }}
                        >
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

      <EditUserModal
        open={!!editingUser}
        onOpenChange={(open) => {
          if (!open) setEditingUser(null)
        }}
        user={editingUser}
        onUserUpdated={handleUserUpdated}
      />

      <AlertDialog
        open={!!userToDelete}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setUserToDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir <strong>{userToDelete?.name}</strong>? Essa ação remove o acesso da conta e
              os registros vinculados no admin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
