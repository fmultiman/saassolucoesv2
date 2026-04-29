"use client"

import type React from "react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Loader2, CuboidIcon, CheckCircle2 } from "lucide-react"
import { PasswordStrengthIndicator } from "@/components/password-strength-indicator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { logAuthRedirectUrls } from "@/lib/supabase/auth-helpers"
import { supabase } from "@/lib/supabase/client"

export default function SignupPage() {
  const searchParams = useSearchParams()
  const planParam = searchParams.get("plan")
  const allowedPlans = ["gratuito", "essencial", "profissional", "completo"]
  const plan = allowedPlans.includes(planParam || "") ? planParam : "gratuito"

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  useEffect(() => {
    if (!password) {
      setPasswordStrength(0)
      return
    }

    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1

    setPasswordStrength(strength)
  }, [password])

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (password !== confirmPassword) {
        throw new Error("As senhas nao coincidem")
      }

      if (password.length < 8) {
        throw new Error("A senha deve ter pelo menos 8 caracteres")
      }

      const checkResponse = await fetch("/api/users/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const checkPayload = await checkResponse.json()

      if (checkPayload.exists) {
        throw new Error("Este email ja esta em uso")
      }

      const { emailRedirectTo } = logAuthRedirectUrls()
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo,
          data: {
            name,
            plan,
            user_type: "client",
          },
        },
      })

      if (signUpError) {
        const message = signUpError.message?.toLowerCase() || ""
        if (
          message.includes("already registered") ||
          message.includes("already exists") ||
          message.includes("user already registered") ||
          signUpError.status === 400
        ) {
          throw new Error("Este email ja esta em uso")
        }

        throw signUpError
      }

      if (!data?.user) {
        throw new Error("Erro ao criar usuario")
      }

      setSuccess(true)
    } catch (signupError) {
      setError(signupError instanceof Error ? signupError.message : "Ocorreu um erro ao fazer o cadastro")
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
          <CardTitle className="text-2xl">Criar Conta</CardTitle>
          <CardDescription>Cadastre-se para acessar a plataforma</CardDescription>
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
                <h3 className="text-xl font-semibold">Cadastro realizado com sucesso!</h3>
              </div>
              <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
                <AlertDescription>
                  <p>
                    Enviamos um email de confirmacao para <strong>{email}</strong>.
                  </p>
                  <p className="text-sm mt-2">
                    Por favor, verifique sua caixa de entrada e clique no link de confirmacao para ativar sua conta.
                  </p>
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" type="text" placeholder="Seu nome completo" value={name} onChange={(event) => setName(event.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" placeholder="******" value={password} onChange={(event) => setPassword(event.target.value)} required />
                <PasswordStrengthIndicator strength={passwordStrength} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="******"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  "Registrar"
                )}
              </Button>
            </form>
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
