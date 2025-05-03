"use client"

import type { Database } from "@/lib/supabase/types"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Post = Database["public"]["Tables"]["posts"]["Row"]

interface AdminPostsListProps {
  posts: Post[]
}

export function AdminPostsList({ posts: initialPosts }: AdminPostsListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [deletePostId, setDeletePostId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDeletePost = async () => {
    if (!deletePostId) return

    setIsDeleting(true)

    const { error } = await supabase.from("posts").delete().eq("id", deletePostId)

    setIsDeleting(false)

    if (error) {
      console.error("Erro ao deletar post:", error)
      return
    }

    // Atualizar a lista de posts
    setPosts(posts.filter((post) => post.id !== deletePostId))
    setDeletePostId(null)
    router.refresh()
  }

  return (
    <>
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">Nenhum post encontrado.</p>
            <p className="text-muted-foreground mt-2">Clique em "Novo Post" para começar a criar conteúdo.</p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div>
                <h2 className="font-medium">{post.titulo}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <Badge variant={post.publicado ? "success" : "secondary"}>
                    {post.publicado ? "Publicado" : "Rascunho"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{formatDate(post.data_publicacao)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/posts/${post.id}`}>
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Link>
                </Button>

                <Button variant="destructive" size="icon" onClick={() => setDeletePostId(post.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <AlertDialog open={!!deletePostId} onOpenChange={(open) => !open && setDeletePostId(null)}>
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
              onClick={handleDeletePost}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
