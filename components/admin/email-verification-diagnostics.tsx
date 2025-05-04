"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function EmailVerificationDiagnostics() {
  const [testEmail, setTestEmail] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testEmailVerification = async () => {
    if (!testEmail) {
      setError("Por favor, insira um email para testar")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Enviar email de verificação de teste
      const { data, error: signInError } = await supabase.auth.signInWithOtp({
        email: testEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify`,
        },
      })

      if (signInError) {
        throw signInError
      }

      // Obter configurações do Supabase
      const { data: settings, error: settingsError } = await supabase.auth.getSettings()

      if (settingsError) {
        throw settingsError
      }

      setResult({
        message: "Email de verificação enviado com sucesso!",
        email: testEmail,
        redirectTo: `${window.location.origin}/auth/verify`,
        supabaseSettings: settings,
      })
    } catch (err: any) {
      console.error("Erro ao testar verificação de email:", err)
      setError(err.message || "Ocorreu um erro ao testar a verificação de email")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Diagnóstico de Verificação de Email</CardTitle>
        <CardDescription>Teste o processo de verificação de email</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Alert className="mb-4 bg-green-500/10 text-green-500 border-green-500/20">
            <AlertDescription>
              <p>{result.message}</p>
              <p className="text-sm mt-2">Verifique a caixa de entrada de {result.email}</p>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="test-email">Email para teste</Label>
            <Input
              id="test-email"
              type="email"
              placeholder="seu@email.com"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
            />
          </div>

          {result && (
            <div className="rounded-md bg-muted p-4 mt-4">
              <h3 className="text-sm font-medium mb-2">Detalhes do Teste</h3>
              <pre className="text-xs overflow-auto p-2 bg-background rounded">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={testEmailVerification} disabled={loading}>
          {loading ? "Enviando email de teste..." : "Enviar Email de Teste"}
        </Button>
      </CardFooter>
    </Card>
  )
}
