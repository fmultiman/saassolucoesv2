"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Post } from "@/lib/supabase/types"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Inicialização direta do cliente Supabase para componentes do cliente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function BlogSection() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRecentPosts() {
      try {
        console.log("Iniciando busca de posts recentes...")
        console.log("URL do Supabase:", supabaseUrl)
        console.log("Chave Anônima definida:", !!supabaseAnonKey)

        // Verificar se as variáveis de ambiente estão definidas
        if (!supabaseUrl || !supabaseAnonKey) {
          console.error("Variáveis de ambiente do Supabase não definidas")
          setError("Configuração incompleta. Entre em contato com o suporte.")
          setIsLoading(false)
          return
        }

        // Criar cliente Supabase diretamente
        const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

        // Buscar posts recentes com retry
        let attempts = 0
        const maxAttempts = 2

        while (attempts < maxAttempts) {
          const { data, error: supabaseError } = await supabase
            .from("posts")
            .select("*")
            .eq("publicado", true)
            .order("data_publicacao", { ascending: false })
            .limit(3)

          if (supabaseError) {
            console.error(`Tentativa ${attempts + 1} falhou:`, supabaseError)
            attempts++
            if (attempts >= maxAttempts) {
              setError("Não foi possível carregar os posts recentes.")
              throw supabaseError
            }
            // Wait before retrying
            await new Promise((resolve) => setTimeout(resolve, 1000))
          } else {
            console.log("Posts recuperados:", data?.length || 0)
            setPosts(data || [])
            setError(null)
            break
          }
        }
      } catch (error) {
        console.error("Erro ao buscar posts recentes:", error)
        setError("Ocorreu um erro ao carregar os posts.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentPosts()
  }, [])

  return (
    <section id="blog" className="py-16 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Nosso Blog</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Fique por dentro das novidades, dicas e tendências em automação de processos e soluções para empresas.
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mx-auto max-w-5xl mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}{" "}
              <Button variant="link" className="p-0 h-auto" onClick={() => window.location.reload()}>
                Tentar novamente
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
          {isLoading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <Skeleton className="h-48 w-full rounded-none" />
                  </CardHeader>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-9 w-full" />
                  </CardFooter>
                </Card>
              ))
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post.id} className="overflow-hidden flex flex-col">
                <CardHeader className="p-0">
                  {post.imagem_capa ? (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={post.imagem_capa || "/placeholder.svg"}
                        alt={post.titulo}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">Sem imagem</span>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-6 flex-grow">
                  <CardTitle className="mb-2 line-clamp-2">{post.titulo}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.conteudo?.replace(/<[^>]*>/g, "").substring(0, 150)}...
                  </CardDescription>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-xs text-muted-foreground">{formatDate(post.data_publicacao || "")}</span>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/blog/${post.slug}`}>Ler mais</Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-muted-foreground">Nenhum post encontrado.</p>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/blog">Ver todos os posts</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
