"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { useToast } from "@/components/ui/use-toast"

type PlanOption = {
  id: number
  name: string
  code: string | null
}

type EditableUser = {
  id: string
  name: string
  email: string
  status: string
  plan: string
  user_type: string
}

type EditUserModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: EditableUser | null
  onUserUpdated: (user: Partial<EditableUser> & { id: string }) => void
}

export function EditUserModal({ open, onOpenChange, user, onUserUpdated }: EditUserModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [plans, setPlans] = useState<PlanOption[]>([])
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    tipoAcesso: "client",
    plano: "gratuito",
    status: "active",
  })
  const { toast } = useToast()

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const response = await fetch("/api/plans")
        if (!response.ok) {
          throw new Error(`Erro ao buscar planos: ${response.status}`)
        }

        const data = (await response.json()) as PlanOption[]
        setPlans(data)
      } catch (error) {
        console.error("Erro ao carregar planos:", error)
      }
    }

    if (open) {
      void loadPlans()
    }
  }, [open])

  useEffect(() => {
    if (!user) return

    setFormData({
      nome: user.name || "",
      email: user.email || "",
      tipoAcesso: user.user_type === "admin" ? "admin" : "client",
      plano: user.plan || "gratuito",
      status: user.status || "active",
    })
  }, [user])

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!user) return

      setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.nome,
          status: formData.status,
          plan: formData.tipoAcesso === "client" ? formData.plano : undefined,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Erro ao atualizar usuário")
      }

      onUserUpdated({
        ...user,
        name: formData.nome,
        status: formData.status,
        plan: formData.tipoAcesso === "client" ? formData.plano : user.plan,
      })

      toast({
        title: "Usuário atualizado com sucesso!",
        description: formData.email,
      })

      onOpenChange(false)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro inesperado"
      console.error("Erro ao atualizar usuário:", error)
      toast({
        variant: "destructive",
        title: "Erro ao atualizar usuário",
        description: message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>Atualize os dados do usuário e o plano vinculado no banco de dados.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-nome" className="text-right">
                Nome
              </Label>
              <Input
                id="edit-nome"
                value={formData.nome}
                onChange={(event) => handleChange("nome", event.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input id="edit-email" value={formData.email} className="col-span-3" disabled />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-tipo" className="text-right">
                Tipo
              </Label>
              <Input id="edit-tipo" value={formData.tipoAcesso === "admin" ? "Administrador" : "Cliente"} className="col-span-3" disabled />
            </div>

            {formData.tipoAcesso === "client" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-plano" className="text-right">
                  Plano
                </Label>
                <Select value={formData.plano} onValueChange={(value) => handleChange("plano", value)}>
                  <SelectTrigger id="edit-plano" className="col-span-3">
                    <SelectValue placeholder="Plano" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.code || plan.name.toLowerCase()}>
                        {plan.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger id="edit-status" className="col-span-3">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="suspended">Suspenso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar alterações"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
