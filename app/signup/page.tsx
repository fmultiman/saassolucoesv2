"use client"

import type React from "react"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { Loader2, CuboidIcon, CheckCircle2 } from "lucide-react"
import { sendMagicLink } from "@/lib/auth/browser-auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GoogleAuthButton } from "@/components/auth/google-auth-button"
import { AuthDivider } from "@/components/auth/auth-divider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignupPage() {
  const searchParams = useSearchParams()
  const planParam = searchParams.get("plan")
  const allowedPlans = ["gratuito", "essencial", "profissional", "completo"]
  const plan = allowedPlans.includes(planParam || "") ? planParam : "gratuito"

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const checkResponse = await fetch("/api/users/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const checkPayload = await checkResponse.json()

      if (checkPayload.exists) {
        throw new Error("Este email ja esta em uso")
      }

      const { error: magicLinkError } = await sendMagicLink({
        email,
        shouldCreateUser: true,
        data: {
          name,
          plan,
          user_type: "client",
        },
      })

      if (magicLinkError) {
        throw magicLinkError
      }

      setSuccess(true)
    } catch (signupError) {
      setError(signupError instanceof Error ? signupError.message : "Ocorreu um erro ao fazer o cadastro")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-md bg-primary/10 p-2">
              <CuboidIcon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Criar Conta</CardTitle>
          <CardDescription>Comece com Google ou receba um link magico para acessar a plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center space-y-2 py-4">
                <div className="rounded-full bg-green-100 p-2">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Cadastro iniciado com sucesso!</h3>
              </div>
              <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
                <AlertDescription>
                  <p>
                    Enviamos um link de acesso para <strong>{email}</strong>.
                  </p>
                  <p className="mt-2 text-sm">Abra o email e clique no link para concluir seu acesso.</p>
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <>
              <GoogleAuthButton disabled={loading} />
              <AuthDivider />
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </div>
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
                    "Continuar com email"
                  )}
                </Button>
              </form>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Ja tem uma conta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Faca login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
