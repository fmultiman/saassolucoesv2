import { CheckCircle, Settings, BarChart } from "lucide-react"

export function ComoFuncionaSection() {
  const steps = [
    {
      icon: CheckCircle,
      title: "Escolha uma solução no painel",
      description: "Navegue pelo catálogo e selecione a solução que melhor atende às suas necessidades.",
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      icon: Settings,
      title: "Personalize com seus dados",
      description: "Ajuste as configurações, adicione suas informações e personalize a solução para seu negócio.",
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      icon: BarChart,
      title: "Ative e acompanhe os resultados",
      description: "Com um clique, sua solução está no ar. Monitore o desempenho e os resultados em tempo real.",
      color: "bg-green-500/10 text-green-500",
    },
  ]

  return (
    <section id="como-funciona" className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ative em poucos cliques. A IA faz o resto.</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sem complicação, sem código, sem dor de cabeça. Apenas resultados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${step.color}`}>
                <step.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute transform translate-x-[150%]">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg max-w-2xl mx-auto">
            Você não precisa entender de tecnologia. Nós já deixamos tudo pronto pra você ativar.
          </p>
        </div>
      </div>
    </section>
  )
}
