"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

export function AuthFixButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const handleFixAuth = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/admin/fix-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      setResult({
        success: data.success,
        message: data.message,
      })
    } catch (error) {
      setResult({
        success: false,
        message: "Erro ao executar correção: " + (error instanceof Error ? error.message : "Erro desconhecido"),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <h3 className="text-lg font-medium">Corrigir Problemas de Autenticação</h3>
        <p className="text-sm text-muted-foreground">
          Use esta ferramenta para corrigir problemas com o sistema de autenticação, como erros de login ou problemas
          com perfis de usuário.
        </p>
        <p className="text-sm text-muted-foreground">Esta ferramenta irá:</p>
        <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
          <li>Verificar e corrigir a estrutura da tabela profiles</li>
          <li>Corrigir o trigger handle_new_user</li>
          <li>Atualizar as permissões e políticas de segurança</li>
          <li>Sincronizar dados existentes entre auth.users e public.profiles</li>
        </ul>
      </div>

      <div className="flex items-center space-x-4">
        <Button onClick={handleFixAuth} disabled={isLoading} variant="default">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Aplicando correção...
            </>
          ) : (
            "Aplicar Correção"
          )}
        </Button>

        {result && (
          <div className={`flex items-center text-sm ${result.success ? "text-green-600" : "text-red-600"}`}>
            {result.success ? <CheckCircle className="mr-2 h-4 w-4" /> : <AlertCircle className="mr-2 h-4 w-4" />}
            {result.message}
          </div>
        )}
      </div>
    </div>
  )
}
