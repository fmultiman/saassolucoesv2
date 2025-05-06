"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { AvatarUpload } from "@/components/avatar-upload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Profile } from "@/types/user"
import { EmailChangeForm } from "@/components/email-change-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Nome deve ter pelo menos 2 caracteres.",
    })
    .max(100),
  bio: z
    .string()
    .max(500, {
      message: "Bio não pode ter mais de 500 caracteres.",
    })
    .optional()
    .nullable(),
  phone: z
    .string()
    .max(20, {
      message: "Telefone não pode ter mais de 20 caracteres.",
    })
    .optional()
    .nullable(),
  job_title: z
    .string()
    .max(100, {
      message: "Cargo não pode ter mais de 100 caracteres.",
    })
    .optional()
    .nullable(),
  company_name: z
    .string()
    .max(100, {
      message: "Nome da empresa não pode ter mais de 100 caracteres.",
    })
    .optional()
    .nullable(),
  company_size: z
    .string()
    .max(50, {
      message: "Tamanho da empresa não pode ter mais de 50 caracteres.",
    })
    .optional()
    .nullable(),
  industry: z
    .string()
    .max(100, {
      message: "Indústria não pode ter mais de 100 caracteres.",
    })
    .optional()
    .nullable(),
  website: z
    .string()
    .url({
      message: "Por favor, insira uma URL válida.",
    })
    .optional()
    .nullable()
    .or(z.literal("")),
  location: z
    .string()
    .max(100, {
      message: "Localização não pode ter mais de 100 caracteres.",
    })
    .optional()
    .nullable(),
  avatar_url: z.string().url().optional().nullable(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface ProfileFormProps {
  profile: Partial<Profile> | null
  onUpdateProfile: (data: any) => Promise<{ success?: boolean; error?: Error }>
  isAdmin?: boolean
  userEmail?: string
}

export function ProfileForm({ profile, onUpdateProfile, isAdmin = false, userEmail }: ProfileFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)

  console.log("ProfileForm - profile recebido:", profile)

  // Valores padrão do formulário
  const defaultValues: Partial<ProfileFormValues> = {
    name: profile?.name ?? "",
    bio: profile?.bio ?? "",
    phone: profile?.phone ?? "",
    job_title: profile?.job_title ?? "",
    company_name: profile?.company_name ?? "",
    company_size: profile?.company_size ?? "",
    industry: profile?.industry ?? "",
    website: profile?.website ?? "",
    location: profile?.location ?? "",
    avatar_url: profile?.avatar_url ?? null,
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  })

  async function onSubmit(data: ProfileFormValues) {
    setIsSubmitting(true)
    try {
      const result = await onUpdateProfile(data)

      if (result.success) {
        toast({
          title: "Perfil atualizado",
          description: "Suas informações foram atualizadas com sucesso.",
        })
      } else if (result.error) {
        throw result.error
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar perfil",
        description: error.message || "Ocorreu um erro ao atualizar seu perfil.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Função para atualizar o avatar
  const handleAvatarChange = (url: string | null) => {
    form.setValue("avatar_url", url)
  }

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Senhas não coincidem",
        description: "A nova senha e a confirmação devem ser iguais.",
      })
      return
    }

    setIsChangingPassword(true)
    try {
      // Atualiza a senha do usuário logado
      // O Supabase exige apenas o novo password, mas pode-se adicionar lógica para checar a senha atual se necessário
      const { error } = await (window as any).supabase.auth.updateUser({
        password: newPassword,
      })
      if (error) throw error
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso.",
      })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar senha",
        description: error.message || "Ocorreu um erro ao atualizar sua senha.",
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const companySizes = [
    { value: "1-10", label: "1-10 funcionários" },
    { value: "11-50", label: "11-50 funcionários" },
    { value: "51-200", label: "51-200 funcionários" },
    { value: "201-500", label: "201-500 funcionários" },
    { value: "501-1000", label: "501-1000 funcionários" },
    { value: "1001+", label: "Mais de 1000 funcionários" },
  ]

  const industries = [
    { value: "tecnologia", label: "Tecnologia" },
    { value: "financas", label: "Finanças" },
    { value: "saude", label: "Saúde" },
    { value: "educacao", label: "Educação" },
    { value: "varejo", label: "Varejo" },
    { value: "manufatura", label: "Manufatura" },
    { value: "servicos", label: "Serviços" },
    { value: "entretenimento", label: "Entretenimento" },
    { value: "outro", label: "Outro" },
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col items-center mb-6">
          <AvatarUpload
            currentAvatarUrl={form.watch("avatar_url") ?? null}
            userId={profile?.id ?? ""}
            onAvatarChange={handleAvatarChange}
            size="lg"
          />
          <p className="text-sm text-muted-foreground mt-2">Clique no ícone para fazer upload de uma imagem</p>
        </div>

        {/* Exibir email atual */}
        {userEmail && (
          <div className="mb-6 p-4 bg-muted rounded-md">
            <h3 className="text-sm font-medium mb-1">Email atual</h3>
            <p className="text-sm">{userEmail}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Para alterar seu email, use a opção "Alterar Email" abaixo.
            </p>
            <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="mt-2">
                  Alterar Email
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Alterar Email</DialogTitle>
                  <DialogDescription>
                    Preencha o formulário abaixo para solicitar a alteração do seu email.
                  </DialogDescription>
                </DialogHeader>
                <EmailChangeForm onSuccess={() => setIsEmailDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome completo" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormDescription>Este é o nome que será exibido no seu perfil.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Conte um pouco sobre você"
                  className="resize-none"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormDescription>Uma breve descrição sobre você. Isso será exibido no seu perfil.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="Seu telefone" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="job_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cargo</FormLabel>
                <FormControl>
                  <Input placeholder="Seu cargo" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Empresa</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da sua empresa" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company_size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tamanho da empresa</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value ?? ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tamanho da empresa" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {companySizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Indústria</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a indústria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry.value} value={industry.value}>
                      {industry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://seusite.com.br" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Localização</FormLabel>
                <FormControl>
                  <Input placeholder="Cidade, Estado" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Coluna esquerda: informações do perfil */}
          <div className="flex flex-col gap-6">
            {/* Os campos do formulário de perfil já estão acima deste bloco, então aqui não precisa repetir nada. */}
            {/* Se quiser adicionar algo extra ao lado esquerdo, pode adicionar aqui. */}
          </div>
          {/* Coluna direita: bloco de segurança */}
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>Gerencie suas credenciais de acesso</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  className="w-full"
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? "Alterando..." : "Alterar Senha"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar alterações"}
        </Button>
      </form>
    </Form>
  )
}
