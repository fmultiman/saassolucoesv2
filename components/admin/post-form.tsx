"use client"

import type { Database } from "@/lib/supabase/types"
import { createClient } from "@/lib/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Loader2, Save, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type Post = Database["public"]["Tables"]["posts"]["Row"]

const formSchema = z.object({
  titulo: z.string().min(1, "O título é obrigatório"),
  slug: z
    .string()
    .min(1, "O slug é obrigatório")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "O slug deve conter apenas letras minúsculas, números e hífens"),
  imagem_capa: z.string().url("URL inválida").optional().or(z.literal("")),
  conteudo: z.string().optional(),
  publicado: z.boolean().default(false),
})

interface PostFormProps {
  post?: Post | null
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: post?.titulo || "",
      slug: post?.slug || "",
      imagem_capa: post?.imagem_capa || "",
      conteudo: post?.conteudo || "",
      publicado: post?.publicado || false,
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>, publish = false) => {
    setIsSaving(true)

    // Se publish for true, forçar publicado = true
    if (publish) {
      values.publicado = true
    }

    try {
      if (post) {
        // Atualizar post existente
        const { error } = await supabase
          .from("posts")
          .update({
            ...values,
            data_publicacao: values.publicado && !post.publicado ? new Date().toISOString() : post.data_publicacao,
          })
          .eq("id", post.id)

        if (error) throw error
      } else {
        // Criar novo post
        const { error } = await supabase.from("posts").insert({
          ...values,
          data_publicacao: values.publicado ? new Date().toISOString() : new Date().toISOString(),
        })

        if (error) throw error
      }

      router.refresh()
      router.push("/admin/posts")
    } catch (error) {
      console.error("Erro ao salvar post:", error)
      alert("Ocorreu um erro ao salvar o post. Por favor, tente novamente.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!post) return

    setIsDeleting(true)

    try {
      const { error } = await supabase.from("posts").delete().eq("id", post.id)

      if (error) throw error

      router.refresh()
      router.push("/admin/posts")
    } catch (error) {
      console.error("Erro ao deletar post:", error)
      alert("Ocorreu um erro ao deletar o post. Por favor, tente novamente.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => onSubmit(values))} className="space-y-6">
        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Digite o título do post" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="titulo-do-post" {...field} />
              </FormControl>
              <FormDescription>URL amigável do post (ex: meu-novo-post)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imagem_capa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagem de Capa</FormLabel>
              <FormControl>
                <Input placeholder="https://exemplo.com/imagem.jpg" {...field} />
              </FormControl>
              <FormDescription>URL da imagem de capa do post</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="conteudo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conteúdo</FormLabel>
              <FormControl>
                <Textarea placeholder="Conteúdo do post (HTML ou texto simples)" className="min-h-[300px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="publicado"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Publicado</FormLabel>
                <FormDescription>Marque para tornar o post visível no blog</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/posts")}
            disabled={isSaving || isDeleting}
          >
            Cancelar
          </Button>

          <div className="flex gap-2">
            {post && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" disabled={isSaving || isDeleting}>
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Excluindo...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. O post será permanentemente excluído.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting ? "Excluindo..." : "Excluir"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <Button type="submit" disabled={isSaving || isDeleting}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Rascunho
                </>
              )}
            </Button>

            <Button
              type="button"
              onClick={() => onSubmit(form.getValues(), true)}
              disabled={isSaving || isDeleting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publicando...
                </>
              ) : (
                "Publicar"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
