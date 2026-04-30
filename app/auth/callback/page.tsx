"use client"

import { useEffect } from "react"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthCallbackPage() {
  useEffect(() => {
    const handleAuth = async () => {
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        window.location.href = "/dashboard"
      } else {
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
