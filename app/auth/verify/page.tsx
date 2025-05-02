"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const code = searchParams.get("code")

        if (!code) {
          setError("Código de verificação não encontrado na URL")
          setLoading(false)
          return
        }

        console.log("Código de verificação encontrado:", code)

        const supabase = createClient()

        // Usar o método correto para trocar o código por uma sessão
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
          console.error("Erro ao trocar código por sessão:", error)
          throw error
        }

        setSuccess(true)

        // Redirecionar para o dashboard após verificação bem-sucedida
        setTimeout(() => {
          window.location.href = "/dashboard"
        }, 2000)
      } catch (err: any) {
        console.error("Erro durante a verificação:", err)
        setError("Erro ao verificar email")
      } finally {
        setLoading(false)
      }
    }

    verifyEmail()
  }, [searchParams, router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {loading ? "Verificando Email" : success ? "Email Verificado" : "Erro na Verificação"}
          </CardTitle>
          <CardDescription className="text-center">
            {loading
              ? "Estamos processando sua verificação de email..."
              : success
                ? "Seu email foi verificado com sucesso!"
                : "Não foi possível completar a verificação"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4">
          {loading ? (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-center text-sm text-muted-foreground">
                Por favor, aguarde enquanto verificamos seu email...
              </p>
            </div>
          ) : success ? (
            <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
              <AlertDescription>
                <p>Verificação concluída com sucesso!</p>
                <p className="text-sm mt-2">Você será redirecionado para o dashboard em instantes...</p>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <AlertDescription>
                <p>{error}</p>
                <p className="text-sm mt-2">Por favor, tente novamente ou entre em contato com o suporte.</p>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
