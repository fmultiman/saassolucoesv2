import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function BlogNotFound() {
  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-4">Post não encontrado</h1>
      <p className="text-xl text-muted-foreground mb-8">
        O post que você está procurando não existe ou não está disponível.
      </p>
      <Button asChild>
        <Link href="/blog">Voltar para o blog</Link>
      </Button>
    </div>
  )
}
