import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MessageSquare, Users, Tag } from "lucide-react"

export function SolucoesSection() {
  const solucoes = [
    {
      icon: Calendar,
      title: "Agendamento automático",
      description: "Clientes marcam horários sem precisar falar com você.",
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      icon: Users,
      title: "Recuperar clientes inativos",
      description: "Envie mensagens inteligentes para quem sumiu.",
      color: "bg-green-500/10 text-green-500",
    },
    {
      icon: MessageSquare,
      title: "Autoatendimento no WhatsApp",
      description: "Respostas rápidas com menu inteligente.",
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      icon: Tag,
      title: "Promoções e cupons automáticos",
      description: "Envie campanhas personalizadas com IA.",
      color: "bg-orange-500/10 text-orange-500",
    },
  ]

  return (
    <section id="solucoes" className="py-20 bg-accent/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">O que você quer automatizar hoje?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Escolha entre dezenas de soluções prontas para usar e personalize para o seu negócio em minutos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solucoes.map((solucao, index) => (
            <Card
              key={index}
              className="border border-border/40 transition-all duration-300 hover:shadow-md hover:border-primary/40"
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${solucao.color}`}>
                  <solucao.icon className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4">{solucao.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{solucao.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link href="/dashboard">Conhecer solução</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" asChild>
            <Link href="/dashboard">Ver todas as soluções</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
