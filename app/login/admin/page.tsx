"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, CuboidIcon } from "lucide-react"
import { sendMagicLink } from "@/lib/auth/browser-auth"
import { GoogleAuthButton } from "@/components/auth/google-auth-button"
import { AuthDivider } from "@/components/auth/auth-divider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase/client"

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/admin"
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      const { data, error: sessionError } = await supabase.auth.getSession()
      if (!sessionError && data.session) {
        router.push(redirectTo)
      }
    }

    void checkSession()
  }, [redirectTo, router])

  const handleMagicLinkLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
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

      setSuccess("Enviamos um link de acesso para seu email. Abra o link para continuar.")
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : "Ocorreu um erro ao enviar o link de acesso."
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-md bg-primary/10 p-2">
              <CuboidIcon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Login Administrativo</CardTitle>
          <CardDescription>Entre com Google ou receba um link magico por email.</CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success ? (
            <Alert className="mb-4 bg-green-500/10 text-green-500 border-green-500/20">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          ) : null}

          <GoogleAuthButton disabled={isLoading} />
          <AuthDivider />
          <form onSubmit={handleMagicLinkLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando link...
                </>
              ) : (
                "Entrar com email"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 text-center">
          <p className="text-sm text-muted-foreground">
            <Link href="/" className="text-primary hover:underline">
              Voltar para o site
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
