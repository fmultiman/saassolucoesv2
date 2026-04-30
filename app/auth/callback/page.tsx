"use client"

import { useEffect } from "react"
import { Loader2 } from "lucide-react"
import type { UserRow } from "@/types/app-user"
import { logError, logInfo } from "@/lib/logger"
import { redirectAfterLogin } from "@/lib/auth/redirectAfterLogin"
import { supabase } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthCallbackPage() {
  useEffect(() => {
    const handleAuth = async () => {
      try {
        const url = new URL(window.location.href)
        const code = url.searchParams.get("code")

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)

          if (error) {
            throw error
          }

          logInfo("AUTH_CALLBACK_EXCHANGE_SUCCESS", { hasCode: true })
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError || !session) {
          throw sessionError ?? new Error("Sessao nao encontrada apos callback")
        }

        const profileResponse = await fetch("/api/user/profile", {
          method: "GET",
          cache: "no-store",
        })
        const payload = (await profileResponse.json().catch(() => null)) as { user?: UserRow } | null

        if (!profileResponse.ok || !payload?.user) {
          throw new Error("Nao foi possivel sincronizar o perfil do usuario")
        }

        window.location.href = redirectAfterLogin(payload.user)
      } catch (error) {
        logError("AUTH_CALLBACK_ERROR", error)
        window.location.href = "/login?error=auth_failed"
      }
    }

    void handleAuth()
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Autenticando...</CardTitle>
          <CardDescription>Estamos finalizando seu acesso.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-center text-sm text-muted-foreground">
            Aguarde alguns instantes enquanto validamos sua sessao.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
