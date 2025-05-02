import type { Metadata } from "next"
import { generateMetadata as generateDefaultMetadata } from "@/lib/metadata"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { viewport } from "@/lib/viewport"

export { viewport }

// Gerando metadados dinâmicos baseados no post
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createServerClient(cookies())

  const { data: post } = await supabase
    .from("posts")
    .select("title, description, featured_image")
    .eq("slug", params.slug)
    .single()

  if (!post) {
    return generateDefaultMetadata({
      title: "Post não encontrado",
      description: "O artigo que você está procurando não existe ou foi removido",
      noIndex: true,
    })
  }

  return generateDefaultMetadata({
    title: post.title,
    description: post.description || `Leia mais sobre ${post.title}`,
    image: post.featured_image || undefined,
  })
}

// Resto do código existente...

export default function Page() {
  return <div>{/* Conteúdo do post aqui */}</div>
}
