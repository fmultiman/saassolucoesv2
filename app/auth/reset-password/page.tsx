"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CuboidIcon, CheckCircle2 } from "lucide-react"
import { PasswordStrengthIndicator } from "@/components/password-strength-indicator"
import { createClient } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [validatingToken, setValidatingToken] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)

  useEffect(() => {
    const validateToken = async () => {
      try {
        // Verificar se há um token na URL
        const token = searchParams.get("token")

        if (!token) {
          setError("Token de redefinição não encontrado")
          setValidatingToken(false)
          return
        }

        // Verificar se o token é válido
        // Apenas verificamos se conseguimos obter a sessão
        // O Supabase não tem um método específico para validar o token
        const supabase = createClient()
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Erro ao validar token:", error)
          setError("Token de redefinição inválido ou expirado")
          setTokenValid(false)
        } else {
          setTokenValid(true)
        }
      } catch (err) {
        console.error("Erro ao validar token:", err)
        setError("Ocorreu um erro ao validar o token")
        setTokenValid(false)
      } finally {
        setValidatingToken(false)
      }
    }

    validateToken()
  }, [searchParams])

  const handleResetPassword = async (e: React.FormEvent) => {
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

      // Atualizar a senha
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        throw error
      }

      setSuccess(true)

      // Redirecionar para o login após alguns segundos
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err: any) {
      console.error("Erro ao redefinir senha:", err)
      setError(err.message || "Ocorreu um erro ao redefinir a senha")
    } finally {
      setLoading(false)
    }
  }

  if (validatingToken) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Verificando...</CardTitle>
            <CardDescription>Estamos validando seu token de redefinição</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    )
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
          <CardTitle className="text-2xl">Redefinir Senha</CardTitle>
          <CardDescription>Crie uma nova senha para sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!tokenValid && !error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                Token de redefinição inválido ou expirado. Por favor, solicite uma nova redefinição de senha.
              </AlertDescription>
            </Alert>
          ) : success ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center space-y-2 py-4">
                <div className="rounded-full bg-green-100 p-2">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Senha redefinida com sucesso!</h3>
              </div>
              <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
                <AlertDescription>
                  <p>Sua senha foi atualizada.</p>
                  <p className="text-sm mt-2">Você será redirecionado para a página de login em instantes...</p>
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nova Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={!tokenValid}
                />
                <PasswordStrengthIndicator strength={password ? 1 : 0} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="******"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={!tokenValid}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading || !tokenValid}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Redefinir Senha"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
