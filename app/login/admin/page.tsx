"use client"

// 🔐 Página de autenticação — usa nova instância Supabase

import type React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2, CuboidIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client" // ✅ NOVO
const supabase = createClient() // ✅ NOVO

const formSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "A senha é obrigatória"),
})

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
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.error("Erro ao verificar sessão:", error)
          return
        }
        if (data.session) {
          console.log("Sessão encontrada, redirecionando...")
          router.push(redirectTo)
        }
      } catch (err) {
        console.error("Erro ao verificar sessão:", err)
      }
    }

    checkSession()
  }, [router, redirectTo])

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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setError("Credenciais inválidas. Verifique seu email e senha.")
        } else if (error.message.includes("Email not confirmed")) {
          setError("Email não confirmado. Por favor, verifique sua caixa de entrada.")
        } else {
          setError(`Erro ao fazer login: ${error.message}`)
        }
        setIsLoading(false)
        return
      }

      if (!data.session) {
        setError("Não foi possível iniciar a sessão. Tente novamente.")
        setIsLoading(false)
        return
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("user_type")
        .eq("id", data.session.user.id)
        .single()

      if (userError || userData?.user_type !== "admin") {
        setError("Você não tem permissão para acessar o painel administrativo.")
        await supabase.auth.signOut()
        setIsLoading(false)
        return
      }

      window.location.href = redirectTo
    } catch (error: any) {
      setError("Ocorreu um erro inesperado. Tente novamente mais tarde.")
      console.error("Erro inesperado ao fazer login:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      if (!resetEmail || !resetEmail.includes("@")) {
        setError("Por favor, insira um email válido.")
        setIsLoading(false)
        return
      }

      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      })

      if (error) {
        setError(`Erro ao enviar email de recuperação: ${error.message}`)
        setIsLoading(false)
        return
      }

      setResetSent(true)
    } catch (error: any) {
      setError("Ocorreu um erro ao enviar o email de recuperação.")
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
          <CardDescription>Faça login para acessar o painel administrativo</CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isResetPasswordOpen ? (
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
          ) : (
            <div className="space-y-4">
              {resetSent ? (
                <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
                  <AlertDescription>
                    <p>Email de recuperação enviado!</p>
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
                      onChange={(e) => setResetEmail(e.target.value)}
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
                      "Enviar link de recuperação"
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
