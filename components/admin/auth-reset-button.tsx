"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function AuthResetButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleReset = async () => {
    if (isLoading) return

    setIsLoading(true)
    setStatus("idle")
    setMessage(null)

    try {
      const response = await fetch("/api/admin/reset-auth-system", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erro ao resetar sistema de autenticação")
      }

      setStatus("success")
      setMessage(data.message || "Sistema de autenticação resetado com sucesso")
      setIsDialogOpen(false)
    } catch (error: any) {
      console.error("Erro ao resetar sistema de autenticação:", error)
      setStatus("error")
      setMessage(error.message || "Erro ao resetar sistema de autenticação")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <h3 className="text-lg font-medium">Resetar Sistema de Autenticação</h3>
        <p className="text-sm text-muted-foreground">
          Limpa e reconstrói o sistema de autenticação mantendo a estrutura das tabelas.
        </p>
      </div>

      {status === "success" && (
        <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Sucesso</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {status === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive" className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Resetar Sistema de Autenticação
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Reset do Sistema de Autenticação</DialogTitle>
            <DialogDescription>
              Esta ação irá limpar e reconstruir o sistema de autenticação. A estrutura das tabelas será mantida, mas
              todos os triggers, políticas e funções serão recriados. Tem certeza que deseja continuar?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleReset} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetando...
                </>
              ) : (
                "Confirmar Reset"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
