import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FaqSection() {
  const faqs = [
    {
      question: "Preciso saber programar?",
      answer:
        "Não. Tudo já está pronto para você ativar em poucos cliques. Nossa plataforma foi desenvolvida para ser usada por qualquer pessoa, independentemente de conhecimentos técnicos.",
    },
    {
      question: "Funciona com WhatsApp Business?",
      answer:
        "Sim, usamos integração com API profissional de WhatsApp. Isso permite que você automatize mensagens, atendimentos e muito mais, tudo dentro das políticas oficiais do WhatsApp Business.",
    },
    {
      question: "Posso testar grátis?",
      answer:
        "Sim! Comece com nosso plano gratuito e experimente as soluções. Você pode explorar as funcionalidades básicas e fazer upgrade quando sentir que está pronto para expandir.",
    },
    {
      question: "A plataforma envia mensagens sozinha?",
      answer:
        "Sim. Você escolhe quando e como, e a automação faz o resto. Defina gatilhos, horários e condições, e nossa plataforma cuidará do envio automático das mensagens conforme suas configurações.",
    },
    {
      question: "Posso cancelar a qualquer momento?",
      answer:
        "Sim. Você tem controle total sobre seu plano. Não há contratos de fidelidade, e você pode cancelar sua assinatura quando desejar, sem taxas adicionais ou burocracia.",
    },
  ]

  return (
    <section id="faq" className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Dúvidas comuns</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Encontre respostas para as perguntas mais frequentes sobre nossa plataforma.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
