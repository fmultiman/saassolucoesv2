import { createServerClient } from "@/lib/supabase/server"
import { BlogPostCard } from "@/components/blog/blog-post-card"
import { cookies } from "next/headers"

export default async function BlogPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore)

  try {
    const { data: posts, error } = await supabase
      .from("posts")
      .select("*")
      .eq("publicado", true)
      .order("data_publicacao", { ascending: false })

    if (error) {
      console.error("Erro ao buscar posts:", error)
      throw error
    }

    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-center">Blog</h1>
          <p className="text-muted-foreground text-center mb-8">
            Confira as últimas novidades e artigos sobre nossas soluções
          </p>
        </div>

        {posts && posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">Nenhum post publicado ainda.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {posts?.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Erro na renderização da página do blog:", error)
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-center">Blog</h1>
          <p className="text-muted-foreground text-center mb-8">
            Confira as últimas novidades e artigos sobre nossas soluções
          </p>
        </div>

        <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 mb-6 max-w-4xl mx-auto">
          Ocorreu um erro ao carregar os posts. Por favor, tente novamente mais tarde.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Sem posts para exibir */}
        </div>
      </div>
    )
  }
}
