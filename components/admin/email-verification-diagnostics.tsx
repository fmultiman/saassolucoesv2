"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { getAuthRedirectUrls } from "@/lib/supabase/auth-helpers"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
      const { emailRedirectTo } = getAuthRedirectUrls()
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: testEmail,
        options: {
          emailRedirectTo,
        },
      })

      if (signInError) {
        throw signInError
      }

      const { data: settings, error: settingsError } =
        (await (supabase.auth as any).getSettings?.()) ?? { data: null, error: null }

      if (settingsError) {
        throw settingsError
      }

      setResult({
        message: "Email de verificacao enviado com sucesso!",
        email: testEmail,
        redirectTo: emailRedirectTo,
        supabaseSettings: settings,
      })
    } catch (verificationError) {
      setError(
        verificationError instanceof Error
          ? verificationError.message
          : "Ocorreu um erro ao testar a verificacao de email",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Diagnostico de Verificacao de Email</CardTitle>
        <CardDescription>Teste o processo de verificacao de email</CardDescription>
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
              onChange={(event) => setTestEmail(event.target.value)}
            />
          </div>

          {result && (
            <div className="rounded-md bg-muted p-4 mt-4">
              <h3 className="text-sm font-medium mb-2">Detalhes do Teste</h3>
              <pre className="text-xs overflow-auto rounded bg-background p-2">{JSON.stringify(result, null, 2)}</pre>
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
