import { createClient } from "@/lib/supabase/server"
import { AdminPostsList } from "@/components/admin/admin-posts-list"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Gerenciar Posts",
  description: "Gerencie posts do Blog.",
}

export default async function AdminPostsPage() {
  const supabase = createClient()

  // Verificar se o usuário está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    // Redirecionar para a página de login se não estiver autenticado
    redirect("/admin/login")
  }

  // Buscar todos os posts
  const { data: posts, error } = await supabase.from("posts").select("*").order("data_publicacao", { ascending: false })

  if (error) {
    console.error("Erro ao buscar posts:", error)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gerenciar Posts</h1>

        <Button asChild>
          <Link href="/admin/posts/novo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Post
          </Link>
        </Button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 mb-6">
          Ocorreu um erro ao carregar os posts. Por favor, tente novamente mais tarde.
        </div>
      )}

      <AdminPostsList posts={posts || []} />
    </div>
  )
}
