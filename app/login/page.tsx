"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Loader2, CuboidIcon } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { getAuthRedirectUrls } from "@/lib/supabase/auth-helpers"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type CurrentProfileResponse = {
  user?: {
    user_type?: string | null
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetSent, setResetSent] = useState(false)

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        throw signInError
      }

      if (!data?.session) {
        throw new Error("Nao foi possivel iniciar a sessao")
      }

      const profileResponse = await fetch("/api/user/profile", {
        method: "GET",
        cache: "no-store",
      })
      const profilePayload = (await profileResponse.json().catch(() => null)) as CurrentProfileResponse | null

      if (!profileResponse.ok || !profilePayload?.user?.user_type) {
        throw new Error("Nao foi possivel carregar o perfil do usuario")
      }

      window.location.href = profilePayload.user.user_type === "admin" ? "/admin" : "/dashboard"
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : "Ocorreu um erro ao fazer login."

      if (message.includes("Invalid login credentials")) {
        setError("Email ou senha incorretos. Por favor, verifique suas credenciais.")
      } else if (message.includes("Email not confirmed")) {
        setError("Email nao confirmado. Por favor, verifique sua caixa de entrada.")
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!resetEmail || !resetEmail.includes("@")) {
        setError("Por favor, insira um email valido.")
        return
      }

      const { resetPasswordRedirectTo } = getAuthRedirectUrls()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: resetPasswordRedirectTo,
      })

      if (resetError) {
        throw resetError
      }

      setResetSent(true)
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : "Ocorreu um erro ao enviar o email de recuperacao.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-md bg-primary/10 p-2">
              <CuboidIcon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Faca login para acessar sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isResetPasswordOpen ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="******"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              {resetSent ? (
                <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
                  <AlertDescription>
                    <p>Email de recuperacao enviado!</p>
                    <p className="text-sm mt-2">Verifique sua caixa de entrada.</p>
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={resetEmail}
                      onChange={(event) => setResetEmail(event.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      "Enviar link de recuperacao"
                    )}
                  </Button>
                </form>
              )}
              <Button
                variant="link"
                className="w-full"
                onClick={() => {
                  setIsResetPasswordOpen(false)
                  setResetSent(false)
                  setError(null)
                }}
              >
                Voltar ao login
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center">
          {!isResetPasswordOpen && (
            <Button
              variant="link"
              className="text-sm text-primary hover:underline"
              onClick={() => {
                setIsResetPasswordOpen(true)
                setError(null)
              }}
            >
              Esqueceu a senha?
            </Button>
          )}
          <p className="text-sm text-muted-foreground">
            Nao tem uma conta?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Cadastre-se
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
