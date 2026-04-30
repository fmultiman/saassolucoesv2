"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase/client"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const handleAuthCallback = async () => {
      try {
        const errorParam = searchParams.get("error")
        const errorDescription = searchParams.get("error_description")
        const code = searchParams.get("code")

        if (errorParam) {
          throw new Error(errorDescription || errorParam)
        }

        if (!code) {
          throw new Error("Codigo de autenticacao ausente")
        }

        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        if (exchangeError) {
          throw exchangeError
        }

        router.replace("/dashboard")
      } catch (callbackError) {
        if (!isMounted) return
        setError(callbackError instanceof Error ? callbackError.message : "Falha ao concluir autenticacao")
      }
    }

    void handleAuthCallback()

    return () => {
      isMounted = false
    }
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{error ? "Erro na autenticacao" : "Autenticando..."}</CardTitle>
          <CardDescription>
            {error
              ? "Nao foi possivel concluir seu acesso."
              : "Estamos validando seu link e criando sua sessao."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4">
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-center text-sm text-muted-foreground">
                Aguarde alguns instantes enquanto finalizamos seu login.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
