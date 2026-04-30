"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, CuboidIcon } from "lucide-react"
import type { UserRow } from "@/types/app-user"
import { redirectAfterLogin } from "@/lib/auth/redirectAfterLogin"
import { supabase } from "@/lib/supabase/client"
import { getAuthRedirectUrls } from "@/lib/supabase/auth-helpers"
import { GoogleAuthButton } from "@/components/auth/google-auth-button"
import { AuthDivider } from "@/components/auth/auth-divider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  email: z.string().email("Email invalido"),
  password: z.string().min(1, "A senha e obrigatoria"),
})

type CurrentProfileResponse = {
  user?: UserRow
}

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/admin"
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetSent, setResetSent] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const { data, error: sessionError } = await supabase.auth.getSession()
      if (!sessionError && data.session) {
        router.push(redirectTo)
      }
    }

    void checkSession()
  }, [redirectTo, router])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (signInError) {
        throw signInError
      }

      if (!data.session) {
        throw new Error("Nao foi possivel iniciar a sessao")
      }

      const profileResponse = await fetch("/api/user/profile", {
        method: "GET",
        cache: "no-store",
      })
      const profilePayload = (await profileResponse.json().catch(() => null)) as CurrentProfileResponse | null

      if (!profileResponse.ok || profilePayload?.user?.user_type !== "admin") {
        await supabase.auth.signOut()
        throw new Error("Voce nao tem permissao para acessar o painel administrativo.")
      }

      window.location.href = redirectAfterLogin(profilePayload.user, { adminRedirectTo: redirectTo })
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : "Ocorreu um erro inesperado."

      if (message.includes("Invalid login credentials")) {
        setError("Credenciais invalidas. Verifique seu email e senha.")
      } else if (message.includes("Email not confirmed")) {
        setError("Email nao confirmado. Por favor, verifique sua caixa de entrada.")
      } else {
        setError(message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault()
    if (isLoading) return

    setIsLoading(true)
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
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-md bg-primary/10 p-2">
              <CuboidIcon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Login Administrativo</CardTitle>
          <CardDescription>Faca login para acessar o painel administrativo</CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isResetPasswordOpen ? (
            <>
              <GoogleAuthButton disabled={isLoading} />
              <AuthDivider />
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="seu@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="******" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                </form>
              </Form>
            </>
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
                    <label htmlFor="reset-email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={resetEmail}
                      onChange={(event) => setResetEmail(event.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
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
            <Link href="/" className="text-primary hover:underline">
              Voltar para o site
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
