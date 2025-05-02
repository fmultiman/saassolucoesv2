"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function PlanosSection() {
  const { toast } = useToast()

  const planos = [
    {
      nome: "Gratuito",
      preco: "R$ 00",
      periodo: "/mês",
      descricao: "Ideal para começar a explorar a plataforma.",
      recursos: ["Até 3 soluções ativas", "Suporte da comunidade", "Recursos básicos"],
      destaque: true,
      botao: "Começar agora",
      plan: "gratuito",
    },
    {
      nome: "Essencial",
      preco: "R$ 99",
      periodo: "/mês",
      descricao: "Para pequenos negócios começando com automação",
      recursos: ["Até 10 soluções ativas", "Integração com WhatsApp", "IA simples", "Suporte por email"],
      destaque: false,
      botao: "Em breve",
      plan: "essencial",
    },
    {
      nome: "Profissional",
      preco: "R$ 249",
      periodo: "/mês",
      descricao: "Para negócios em crescimento que precisam de mais recursos",
      recursos: [
        "Até 25 soluções ativas",
        "IA avançada",
        "Suporte prioritário",
        "Relatórios detalhados",
        "Integrações avançadas",
      ],
      destaque: false,
      botao: "Em breve",
      plan: "profissional",
    },
    {
      nome: "Completo",
      preco: "R$ 599",
      periodo: "/mês",
      descricao: "Para empresas que precisam de recursos avançados e personalização",
      recursos: [
        "Soluções ilimitadas",
        "Multiusuário",
        "Suporte prioritário",
        "API completa",
        "Personalização avançada",
        "Treinamento exclusivo",
      ],
      destaque: false,
      botao: "Em breve",
      plan: "completo",
    },
  ]

  const handlePlanClick = (planName: string) => {
    if (planName !== "gratuito") {
      toast({
        title: "Em breve!",
        description: "Este plano estará disponível em breve.",
      })
    }
  }

  return (
    <section id="planos" className="py-20 bg-accent/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Planos para todos os tamanhos de negócio</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Escolha o plano ideal para o seu negócio e comece a automatizar hoje mesmo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {planos.map((plano, index) => (
            <Card
              key={index}
              className={`flex flex-col ${
                plano.destaque ? "border-primary shadow-lg shadow-primary/20 relative" : "border-border/40"
              }`}
            >
              {plano.destaque && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Mais popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{plano.nome}</CardTitle>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{plano.preco}</span>
                  <span className="text-sm text-muted-foreground">{plano.periodo}</span>
                </div>
                <CardDescription>{plano.descricao}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {plano.recursos.map((recurso, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span>{recurso}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plano.destaque ? "default" : "outline"}
                  asChild
                  onClick={() => handlePlanClick(plano.plan)}
                >
                  {plano.plan === "gratuito" ? (
                    <Link href={`/signup?plan=${plano.plan}`}>{plano.botao}</Link>
                  ) : (
                    <span>{plano.botao}</span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
