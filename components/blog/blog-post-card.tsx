import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface BlogPostCardProps {
  post: {
    id: string
    titulo: string | null
    slug: string | null
    imagem_capa?: string | null
    conteudo?: string | null
    data_publicacao: string | null
  }
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  // Extrair um resumo do conteúdo HTML (removendo tags)
  const getExcerpt = (content?: string) => {
    if (!content) return ""
    const excerpt = content.replace(/<[^>]*>/g, "").substring(0, 120)
    return excerpt.length < content.length ? `${excerpt}...` : excerpt
  }

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative w-full h-48">
        {post.imagem_capa ? (
          <Image
            src={post.imagem_capa || "/placeholder.svg"}
            alt={post.titulo || "Post"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">Sem imagem</span>
          </div>
        )}
      </div>
      <CardContent className="pt-6 flex-1">
        <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.titulo || "Sem titulo"}</h3>
        {post.data_publicacao && <p className="text-sm text-muted-foreground mb-2">{formatDate(post.data_publicacao)}</p>}
        <p className="text-muted-foreground line-clamp-3">{getExcerpt(post.conteudo)}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/blog/${post.slug || post.id}`}>Ler mais</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
