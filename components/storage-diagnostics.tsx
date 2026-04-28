"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface StorageDiagnosticsProps {
  userId?: string
}

export function StorageDiagnostics({ userId }: StorageDiagnosticsProps) {
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const checkStorage = async () => {
    setIsChecking(true)
    setError(null)
    setResult(null)

    try {
      // Verificar sessão
      const { data: sessionData } = await supabase.auth.getSession()

      if (!sessionData.session) {
        setError("Nenhuma sessão ativa encontrada. Faça login novamente.")
        return
      }

      const sessionUserId = sessionData.session.user.id

      // Verificar status do storage via API
      const response = await fetch("/api/storage/check")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao verificar storage")
      }

      setResult({
        ...data,
        sessionUserId,
        propUserId: userId,
      })

      // Tentar fazer upload de teste como cliente
      const testFile = new Blob(["client-test"], { type: "text/plain" })
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("user-content")
        .upload("client-test-" + Date.now() + ".txt", testFile, {
          upsert: true,
        })

      if (uploadError) {
        setError(`Upload de cliente falhou: ${uploadError.message}`)

        // Tentar obter mais informações sobre o erro
        const { data: errorDetails } = await supabase.functions
          .invoke("debug-storage", {
            body: { error: uploadError, bucket: "user-content" },
          })
          .catch(() => ({ data: null }))

        setResult((prev: any) => ({ ...prev, errorDetails }))
      } else {
        setResult((prev: any) => ({ ...prev, clientUpload: uploadData }))
      }
    } catch (err: any) {
      console.error("Erro ao diagnosticar storage:", err)
      setError(err.message || "Erro desconhecido ao verificar storage")
    } finally {
      setIsChecking(false)
    }
  }

  const createBucket = async () => {
    setIsChecking(true)
    setError(null)

    try {
      const response = await fetch("/api/storage/setup", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar bucket")
      }

      setResult(data)
    } catch (err: any) {
      console.error("Erro ao criar bucket:", err)
      setError(err.message || "Erro desconhecido ao criar bucket")
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Diagnóstico de Storage</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={checkStorage} disabled={isChecking}>
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Verificar Storage
              </>
            )}
          </Button>
          <Button variant="default" size="sm" onClick={createBucket} disabled={isChecking}>
            Criar/Configurar Bucket
          </Button>
        </div>
      </div>

      <div className="bg-gray-50 p-3 rounded-md border text-sm">
        <p>
          <strong>ID do Usuário (prop):</strong> {userId || "Não fornecido"}
        </p>
        <p>
          <strong>Bucket esperado:</strong> user-content
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && !error && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-700">Storage verificado</AlertTitle>
          <AlertDescription>
            {result.success
              ? "O bucket 'user-content' está disponível e as políticas estão configuradas."
              : "Verificação concluída, mas há problemas. Veja os detalhes abaixo."}
          </AlertDescription>
        </Alert>
      )}

      {(result || error) && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md border text-xs font-mono overflow-auto max-h-60">
          <pre>{JSON.stringify(result || { error }, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
