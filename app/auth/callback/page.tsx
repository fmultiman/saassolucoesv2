"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { AlertCircle, ExternalLink, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase/client"

type CallbackState = "loading" | "fallback" | "webview" | "error"

function isWebView() {
  if (typeof navigator === "undefined") return false

  const ua = navigator.userAgent || ""
  return /(WebView|Android.*wv|iPhone.*Mobile|iPad.*Mobile|GSA|FBAN|FBAV)/i.test(ua)
}

export default function AuthCallbackPage() {
  const searchParams = useSearchParams()
  const [state, setState] = useState<CallbackState>("loading")
  const [error, setError] = useState<string | null>(null)
  const [webViewDetected, setWebViewDetected] = useState(false)

  const currentUrl = useMemo(() => {
    if (typeof window === "undefined") return ""
    return window.location.href
  }, [])

  useEffect(() => {
    let isMounted = true

    const handleAuthCallback = async () => {
      const detectedWebView = isWebView()
      setWebViewDetected(detectedWebView)

      if (detectedWebView) {
        console.warn("[auth/callback] WebView detectada, instruindo abertura no navegador")
        if (isMounted) {
          setState("webview")
        }
        return
      }

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

        if (!exchangeError) {
          console.info("[auth/callback] PKCE success")
          window.location.href = "/dashboard"
          return
        }

        console.warn("[auth/callback] PKCE failed, fallback triggered", exchangeError)

        if (isMounted) {
          setState("fallback")
        }

        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          console.info("[auth/callback] Fallback found active session")
          window.location.href = "/dashboard"
          return
        }

        console.warn("[auth/callback] Fallback failed, redirecting to login")
        window.location.href = "/login?error=pkce_failed"
      } catch (callbackError) {
        console.error("[auth/callback] Unexpected auth callback error", callbackError)
        if (!isMounted) return
        setError(callbackError instanceof Error ? callbackError.message : "Falha ao concluir autenticacao")
        setState("error")
      }
    }

    void handleAuthCallback()

    return () => {
      isMounted = false
    }
  }, [searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {state === "webview"
              ? "Abra no navegador"
              : state === "error"
                ? "Erro na autenticacao"
                : state === "fallback"
                  ? "Tentando recuperar a sessao"
                  : "Autenticando..."}
          </CardTitle>
          <CardDescription>
            {state === "webview"
              ? "O app de email abriu este link em uma WebView que pode bloquear o fluxo PKCE."
              : state === "error"
                ? "Nao foi possivel concluir seu acesso."
                : state === "fallback"
                  ? "O link foi aberto, mas precisamos tentar recuperar sua sessao com um fallback seguro."
                  : "Estamos validando seu link e criando sua sessao."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4">
          {state === "webview" ? (
            <>
              <Alert>
                <AlertDescription>
                  Para finalizar o login sem erro, abra este link no navegador principal do seu celular.
                </AlertDescription>
              </Alert>
              <a href={currentUrl} target="_blank" rel="noreferrer" className="w-full">
                <Button className="w-full">
                  Abrir no navegador
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
              {webViewDetected && <p className="text-xs text-muted-foreground text-center">WebView detectada automaticamente.</p>}
            </>
          ) : state === "error" ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-center text-sm text-muted-foreground">
                {state === "fallback"
                  ? "O login PKCE falhou nesta tentativa. Estamos verificando se a sessao ja foi criada."
                  : "Aguarde alguns instantes enquanto finalizamos seu login."}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
