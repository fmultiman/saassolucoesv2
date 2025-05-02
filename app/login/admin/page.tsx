"use client"

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
import { createClient } from "@/lib/supabase/client"

const formSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "A senha é obrigatória"),
})

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/admin"

  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetSent, setResetSent] = useState(false)

  // Verificar se já está autenticado
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
  }, [router, supabase.auth, redirectTo])

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
      // Tentar fazer login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (error) {
        console.error("Erro de autenticação:", error)

        // Mensagens de erro mais específicas
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

      // Verificar se o usuário é um admin
      try {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("user_type")
          .eq("id", data.session.user.id)
          .single()

        if (userError) {
          console.error("Erro ao verificar tipo de usuário:", userError)
          setError("Erro ao verificar permissões de usuário.")

          // Fazer logout se não conseguir verificar o tipo de usuário
          await supabase.auth.signOut()
          setIsLoading(false)
          return
        }

        if (userData?.user_type !== "admin") {
          setError("Você não tem permissão para acessar o painel administrativo.")

          // Fazer logout se não for admin
          await supabase.auth.signOut()
          setIsLoading(false)
          return
        }
      } catch (err) {
        console.error("Erro ao verificar tipo de usuário:", err)
        setError("Erro ao verificar permissões de usuário.")

        // Fazer logout em caso de erro
        await supabase.auth.signOut()
        setIsLoading(false)
        return
      }

      // Redirecionar para o dashboard admin
      console.log("Login bem-sucedido, redirecionando para:", redirectTo)
      window.location.href = redirectTo
    } catch (error: any) {
      console.error("Erro inesperado ao fazer login:", error)
      setError("Ocorreu um erro inesperado. Tente novamente mais tarde.")
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
        console.error("Erro ao enviar email de recuperação:", error)
        setError(`Erro ao enviar email de recuperação: ${error.message}`)
        setIsLoading(false)
        return
      }

      setResetSent(true)
      setError(null)
    } catch (error: any) {
      console.error("Erro ao enviar email de recuperação:", error)
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
