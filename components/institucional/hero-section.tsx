import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Soluções inteligentes para o seu negócio crescer com menos esforço.
          </h1>
          <p className="text-xl text-muted-foreground">
            Automatize atendimento, vendas, agendamento, marketing e muito mais com ajuda da inteligência artificial —
            sem precisar programar nada.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="#solucoes">Explorar Soluções</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/signup?plan=gratuito">Testar Grátis</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground pt-4">Tudo em um só lugar. Simples, rápido e feito para você.</p>
        </div>
      </div>
    </section>
  )
}
