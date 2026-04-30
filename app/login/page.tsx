"use client"

import type React from "react"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Loader2, CuboidIcon } from "lucide-react"
import { sendMagicLink } from "@/lib/auth/browser-auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GoogleAuthButton } from "@/components/auth/google-auth-button"
import { AuthDivider } from "@/components/auth/auth-divider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)

  const callbackError = searchParams.get("error")
  const callbackErrorMessage = callbackError === "auth_failed" ? "Nao foi possivel concluir seu login. Tente novamente." : null

  const handleMagicLinkLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { error: magicLinkError } = await sendMagicLink({
        email,
        shouldCreateUser: false,
      })

      if (magicLinkError) {
        throw magicLinkError
      }

      setSuccess("Enviamos um link de acesso para seu email. Abra o link para entrar na plataforma.")
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : "Ocorreu um erro ao enviar o link de acesso."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-md bg-primary/10 p-2">
              <CuboidIcon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Entre com Google ou receba um link magico por email.</CardDescription>
        </CardHeader>
        <CardContent>
          {(error || callbackErrorMessage) && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error || callbackErrorMessage}</AlertDescription>
            </Alert>
          )}

          {success ? (
            <Alert className="mb-4 bg-green-500/10 text-green-500 border-green-500/20">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          ) : null}

          {!isResetPasswordOpen ? (
            <>
              <GoogleAuthButton disabled={loading} />
              <AuthDivider />
              <form onSubmit={handleMagicLinkLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando link...
                    </>
                  ) : (
                    "Entrar com email"
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  O acesso principal agora e por link magico no email ou Google. Se precisar, volte e use um desses fluxos.
                </AlertDescription>
              </Alert>
              <Button
                variant="link"
                className="w-full"
                onClick={() => {
                  setIsResetPasswordOpen(false)
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
                setSuccess(null)
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
