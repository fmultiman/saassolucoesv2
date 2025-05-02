"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, Loader2, UserPlus } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"

interface UserFormData {
  nome: string
  email: string
  tipoAcesso: string
  plano: string
  forceCreate: boolean
}

interface CreateUserModalProps {
  onUserCreated?: () => void
}

export function CreateUserModal({ onUserCreated }: CreateUserModalProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailExists, setEmailExists] = useState(false)
  const [formData, setFormData] = useState<UserFormData>({
    nome: "",
    email: "",
    tipoAcesso: "client",
    plano: "free",
    forceCreate: false,
  })

  const { toast } = useToast()

  const handleChange = (field: keyof UserFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === "email") {
      setEmailExists(false)
      setError(null)
    }
  }

  const checkEmail = async (email: string) => {
    setIsCheckingEmail(true)
    try {
      const res = await fetch("/api/users/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (data.exists) {
        setEmailExists(true)
        setError(`Este email já está em uso (${data.source === "database" ? "tabela users" : "autenticação"}).`)
      } else {
        setEmailExists(false)
        setError(null)
      }
    } catch (err) {
      console.error("Erro ao verificar email:", err)
      setEmailExists(false)
    } finally {
      setIsCheckingEmail(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome || !formData.email) {
      setError("Nome e email são obrigatórios")
      return
    }

    if (emailExists && !formData.forceCreate) {
      setError("Email já existe e criação forçada não foi autorizada.")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Erro ao criar usuário")

      toast({
        title: "Usuário criado com sucesso!",
        description: `Email: ${formData.email}`,
      })

      // Resetar
      setOpen(false)
      setEmailExists(false)
      setFormData({
        nome: "",
        email: "",
        tipoAcesso: "client",
        plano: "free",
        forceCreate: false,
      })

      onUserCreated?.()
    } catch (err: any) {
      console.error("Erro ao criar usuário:", err)
      setError(err.message || "Erro inesperado")
      toast({
        variant: "destructive",
        title: "Erro ao criar usuário",
        description: err.message || "Erro inesperado",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailBlur = () => {
    if (formData.email) checkEmail(formData.email)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Criar Novo Usuário</DialogTitle>
            <DialogDescription>Preencha os dados para adicionar um novo usuário à plataforma.</DialogDescription>
          </DialogHeader>

          {error && !formData.forceCreate && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome" className="text-right">
                Nome
              </Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <div className="col-span-3 relative">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={handleEmailBlur}
                  required
                  className={emailExists && !formData.forceCreate ? "border-red-500 pr-8" : ""}
                />
                {isCheckingEmail && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipoAcesso" className="text-right">
                Tipo
              </Label>
              <Select value={formData.tipoAcesso} onValueChange={(val) => handleChange("tipoAcesso", val)}>
                <SelectTrigger id="tipoAcesso" className="col-span-3">
                  <SelectValue placeholder="Tipo de acesso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Cliente</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.tipoAcesso === "client" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="plano" className="text-right">
                  Plano
                </Label>
                <Select value={formData.plano} onValueChange={(val) => handleChange("plano", val)}>
                  <SelectTrigger id="plano" className="col-span-3">
                    <SelectValue placeholder="Plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Gratuito</SelectItem>
                    <SelectItem value="basic">Starter</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="enterprise">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {emailExists && (
              <div className="flex items-center space-x-2 ml-auto">
                <Checkbox
                  id="forceCreate"
                  checked={formData.forceCreate}
                  onCheckedChange={(val) => handleChange("forceCreate", val === true)}
                />
                <Label htmlFor="forceCreate" className="text-sm text-muted-foreground">
                  Forçar criação mesmo assim
                </Label>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading || (emailExists && !formData.forceCreate)}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Usuário"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
