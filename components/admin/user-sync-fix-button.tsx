"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function UserSyncFixButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState<string | null>(null)

  const handleFix = async () => {
    if (isLoading) return

    setIsLoading(true)
    setStatus("idle")
    setMessage(null)

    try {
      const response = await fetch("/api/admin/fix-user-sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erro ao corrigir sincronização de usuários")
      }

      setStatus("success")
      setMessage(data.message || "Sincronização de usuários corrigida com sucesso")
    } catch (error: any) {
      console.error("Erro ao corrigir sincronização de usuários:", error)
      setStatus("error")
      setMessage(error.message || "Erro ao corrigir sincronização de usuários")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <h3 className="text-lg font-medium">Sincronização de Usuários</h3>
        <p className="text-sm text-muted-foreground">
          Corrige problemas de sincronização entre o sistema de autenticação e as tabelas de usuários.
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

      <Button onClick={handleFix} disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Corrigindo...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Corrigir Sincronização de Usuários
          </>
        )}
      </Button>
    </div>
  )
}
