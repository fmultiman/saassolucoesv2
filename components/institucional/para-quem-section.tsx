import { Scissors, Stethoscope, UtensilsCrossed, ShoppingBag, Wrench, GraduationCap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ParaQuemSection() {
  const negocios = [
    {
      icon: Scissors,
      title: "Salões de Beleza",
      description: "Automatize agendamentos e lembretes para clientes.",
      color: "bg-pink-500/10 text-pink-500",
    },
    {
      icon: Stethoscope,
      title: "Clínicas e Consultórios",
      description: "Organize consultas e envie confirmações automáticas.",
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      icon: UtensilsCrossed,
      title: "Restaurantes e Delivery",
      description: "Gerencie pedidos e fidelização de clientes.",
      color: "bg-orange-500/10 text-orange-500",
    },
    {
      icon: ShoppingBag,
      title: "Lojas e E-commerces",
      description: "Recupere carrinhos abandonados e aumente vendas.",
      color: "bg-green-500/10 text-green-500",
    },
    {
      icon: Wrench,
      title: "Prestadores de Serviço",
      description: "Automatize orçamentos e acompanhamento de projetos.",
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      icon: GraduationCap,
      title: "Educadores e Mentores",
      description: "Organize turmas e envie conteúdos personalizados.",
      color: "bg-cyan-500/10 text-cyan-500",
    },
  ]

  return (
    <section id="para-quem" className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Feito para negócios como o seu</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Nossas soluções são adaptadas para diversos segmentos e tamanhos de negócio.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {negocios.map((negocio, index) => (
            <Card key={index} className="border border-border/40">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${negocio.color}`}>
                  <negocio.icon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle>{negocio.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{negocio.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg font-medium">Se você atende clientes, essa plataforma foi feita pra você.</p>
        </div>
      </div>
    </section>
  )
}
