import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { PostForm } from "@/components/admin/post-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

export const metadata = {
  title: "Editar Post",
  description: "Edite posts do Blog.",
}

interface AdminPostEditPageProps {
  params: {
    id: string
  }
}

export default async function AdminPostEditPage({ params }: AdminPostEditPageProps) {
  const supabase = createServerClient(await cookies())

  // Verificar se o usuário está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    // Redirecionar para a página de login se não estiver autenticado
    redirect("/admin/login")
  }

  // Se o ID for "novo", estamos criando um novo post
  const isNewPost = params.id === "novo"

  // Se não for um novo post, buscar o post existente
  let post = null

  if (!isNewPost) {
    const { data, error } = await supabase.from("posts").select("*").eq("id", params.id).single()

    if (error || !data) {
      notFound()
    }

    post = data
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link
        href="/admin/posts"
        className="flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para lista de posts
      </Link>

      <h1 className="text-3xl font-bold mb-8">{isNewPost ? "Criar Novo Post" : "Editar Post"}</h1>

      <PostForm post={post} />
    </div>
  )
}
