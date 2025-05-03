"use client"

import type React from "react"
import { useSearchParams } from "next/navigation"

import { useState, useEffect } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CuboidIcon, CheckCircle2 } from "lucide-react"
import { PasswordStrengthIndicator } from "@/components/password-strength-indicator"

export default function SignupPage() {
  const searchParams = useSearchParams()
  const planParam = searchParams.get("plan")
  // Só aceita os planos válidos
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

  // Calcular a força da senha quando ela mudar
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0)
      return
    }

    let strength = 0

    // Comprimento mínimo
    if (password.length >= 8) strength += 1

    // Letras minúsculas
    if (/[a-z]/.test(password)) strength += 1

    // Letras maiúsculas
    if (/[A-Z]/.test(password)) strength += 1

    // Números
    if (/[0-9]/.test(password)) strength += 1

    // Caracteres especiais
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1

    setPasswordStrength(strength)
  }, [password])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validações básicas
      if (password !== confirmPassword) {
        throw new Error("As senhas não coincidem")
      }

      if (password.length < 8) {
        throw new Error("A senha deve ter pelo menos 8 caracteres")
      }

      // Verificar se o email já está em uso
      const { data: emailCheckData, error: emailCheckError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle()

      if (emailCheckError) {
        console.error("Erro ao verificar email:", emailCheckError)
      }

      if (emailCheckData) {
        throw new Error("Este email já está em uso")
      }

      // Registrar usuário
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify`,
          data: {
            name: name,
            plan: plan,
          },
        },
      })

      if (signUpError) {
        throw signUpError
      }

      if (!data?.user) {
        throw new Error("Erro ao criar usuário")
      }

      // Inserir tipo de usuário na tabela users
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: data.user.id,
          email: email,
          user_type: "client",
          name: name,
          plan: plan,
        },
      ])

      if (insertError) {
        console.error("Erro ao inserir tipo de usuário:", insertError)
        // Não bloquear o cadastro se falhar a inserção do tipo
      }

      setSuccess(true)
    } catch (err: any) {
      console.error("Erro ao fazer cadastro:", err)
      setError(err.message || "Ocorreu um erro ao fazer o cadastro")
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
                    Enviamos um email de confirmação para <strong>{email}</strong>.
                  </p>
                  <p className="text-sm mt-2">
                    Por favor, verifique sua caixa de entrada e clique no link de confirmação para ativar sua conta.
                  </p>
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <PasswordStrengthIndicator strength={passwordStrength} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="******"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  "Cadastrar"
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Faça login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
