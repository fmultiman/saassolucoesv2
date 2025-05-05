"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client" // ✅ NOVO
const supabase = createClient() // ✅ NOVO

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Log todos os parâmetros para depuração
        console.log("Todos os parâmetros da URL:", {
          code: searchParams.get("code"),
          token: searchParams.get("token"),
          type: searchParams.get("type"),
          error: searchParams.get("error"),
          error_description: searchParams.get("error_description"),
          fullUrl: typeof window !== "undefined" ? window.location.href : "N/A",
        })

        // Verificar se há erro nos parâmetros
        const errorParam = searchParams.get("error")
        const errorDescription = searchParams.get("error_description")

        if (errorParam) {
          throw new Error(`Erro retornado pelo Supabase: ${errorParam} - ${errorDescription || "Sem descrição"}`)
        }

        // O Supabase Auth já deve ter processado o código/token automaticamente
        // devido à configuração detectSessionInUrl: true no cliente
        // const supabase = createClient()

        // Verificar se a sessão já foi estabelecida
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Erro ao obter sessão:", sessionError)
          throw sessionError
        }

        if (!session) {
          // Se não houver sessão, pode ser que o código não tenha sido processado automaticamente
          console.log("Nenhuma sessão encontrada, verificando se há código para trocar manualmente")

          const code = searchParams.get("code")
          if (code) {
            console.log("Tentando trocar código por sessão manualmente:", code)
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

            if (exchangeError) {
              console.error("Erro ao trocar código por sessão:", exchangeError)
              throw exchangeError
            }
          } else {
            throw new Error("Nenhum código de verificação encontrado na URL e nenhuma sessão estabelecida")
          }
        } else {
          console.log("Sessão já estabelecida:", session.user.id)
        }

        setSuccess(true)

        // Redirecionar para o dashboard após verificação bem-sucedida
        setTimeout(() => {
          window.location.href = "/dashboard"
        }, 2000)
      } catch (err: any) {
        console.error("Erro durante a verificação:", err)
        setError(err.message || "Erro ao verificar email")
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
