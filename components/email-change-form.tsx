"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const emailChangeSchema = z.object({
  newEmail: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
})

type EmailChangeFormProps = {
  currentEmail?: string
  onSuccess?: () => void
}

export function EmailChangeForm({ currentEmail, onSuccess }: EmailChangeFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const form = useForm<z.infer<typeof emailChangeSchema>>({
    resolver: zodResolver(emailChangeSchema),
    defaultValues: {
      newEmail: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof emailChangeSchema>) => {
    if (isLoading) return
    if (values.newEmail === currentEmail) {
      setError("O novo email é igual ao atual")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Verificar senha atual
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: currentEmail || "",
        password: values.password,
      })

      if (signInError) {
        setError("Senha incorreta")
        setIsLoading(false)
        return
      }

      // Enviar solicitação de alteração de email
      const { error: updateError } = await supabase.auth.updateUser({
        email: values.newEmail,
      })

      if (updateError) {
        throw updateError
      }

      setSuccess(true)
      form.reset()

      // Chamar callback de sucesso se fornecido
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 2000)
      }
    } catch (err: any) {
      console.error("Erro ao alterar email:", err)
      setError(err.message || "Ocorreu um erro ao solicitar a alteração de email")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
          <AlertDescription>
            <p>Solicitação enviada com sucesso!</p>
            <p className="text-sm mt-2">
              Enviamos um link de confirmação para o novo email. Por favor, verifique sua caixa de entrada e clique no
              link para confirmar a alteração.
            </p>
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="newEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Novo Email</FormLabel>
                <FormControl>
                  <Input placeholder="novo@email.com" {...field} />
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
                <FormLabel>Confirme sua senha atual</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Solicitar alteração"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
