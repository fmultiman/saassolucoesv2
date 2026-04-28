import type { Metadata, ResolvingMetadata } from "next"
import { generateMetadata as generateDefaultMetadata } from "@/lib/metadata"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { viewport } from "@/lib/viewport"
import { notFound } from "next/navigation"
import { formatDate } from "@/lib/utils"

export { viewport }

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BlogPostPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params
  const supabase = createServerClient(await cookies())

  const { data: post } = await supabase
    .from("posts")
    .select("titulo, title, description, conteudo, featured_image, imagem_capa, publicado")
    .eq("slug", slug)
    .eq("publicado", true)
    .single()

  if (!post) {
    return generateDefaultMetadata({
      title: "Post não encontrado",
      description: "O artigo que você está procurando não existe ou foi removido",
      noIndex: true,
    })
  }

  return generateDefaultMetadata({
    title: post.title || post.titulo,
    description: post.description || `Leia mais sobre ${post.title || post.titulo}`,
    image: post.featured_image || post.imagem_capa || undefined,
  })
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const supabase = createServerClient(await cookies())

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("publicado", true)
    .single()

  if (error || !post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">{post.titulo || post.title}</h1>
        {post.data_publicacao && (
          <p className="text-muted-foreground mb-8">
            Publicado em {formatDate(post.data_publicacao)}
          </p>
        )}
        {(post.imagem_capa || post.featured_image) && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={post.imagem_capa || post.featured_image || "/placeholder.svg"}
              alt={post.titulo || post.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.conteudo || "" }} />
      </div>
    </div>
  )
}
