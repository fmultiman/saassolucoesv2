"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { logAuthRedirectUrls } from "@/lib/supabase/auth-helpers"
import { createAuthClient } from "@/lib/supabase/auth-config"

export function AuthRedirectDiagnostics() {
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runDiagnostics = async () => {
    setLoading(true)
    setError(null)

    try {
      // Obter URLs de redirecionamento
      const redirectUrls = logAuthRedirectUrls()

      // Verificar configuração do Supabase
      const supabase = createAuthClient()
      const { data: settings, error: settingsError } =
        (await (supabase.auth as any).getSettings?.()) ?? { data: null, error: null }

      if (settingsError) {
        throw new Error(`Erro ao obter configurações do Supabase: ${settingsError.message}`)
      }

      // Compilar informações de diagnóstico
      setDiagnosticInfo({
        redirectUrls,
        supabaseSettings: settings || "Não foi possível obter configurações",
        environment: {
          NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "Não definido",
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "Não definido",
          windowLocation: typeof window !== "undefined" ? window.location.origin : "N/A (server)",
          nodeEnv: process.env.NODE_ENV || "Não definido",
        },
      })
    } catch (err: any) {
      console.error("Erro ao executar diagnóstico:", err)
      setError(err.message || "Ocorreu um erro ao executar o diagnóstico")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Diagnóstico de Redirecionamento de Autenticação</CardTitle>
        <CardDescription>Verifique as configurações de redirecionamento para autenticação</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {diagnosticInfo && (
          <div className="space-y-4">
            <div className="rounded-md bg-muted p-4">
              <h3 className="text-sm font-medium mb-2">URLs de Redirecionamento</h3>
              <pre className="text-xs overflow-auto p-2 bg-background rounded">
                {JSON.stringify(diagnosticInfo.redirectUrls, null, 2)}
              </pre>
            </div>

            <div className="rounded-md bg-muted p-4">
              <h3 className="text-sm font-medium mb-2">Variáveis de Ambiente</h3>
              <pre className="text-xs overflow-auto p-2 bg-background rounded">
                {JSON.stringify(diagnosticInfo.environment, null, 2)}
              </pre>
            </div>

            <div className="rounded-md bg-muted p-4">
              <h3 className="text-sm font-medium mb-2">Configurações do Supabase</h3>
              <pre className="text-xs overflow-auto p-2 bg-background rounded">
                {JSON.stringify(diagnosticInfo.supabaseSettings, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={runDiagnostics} disabled={loading}>
          {loading ? "Executando diagnóstico..." : "Executar Diagnóstico"}
        </Button>
      </CardFooter>
    </Card>
  )
}
