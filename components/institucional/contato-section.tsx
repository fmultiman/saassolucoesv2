import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

export function ContatoSection() {
  return (
    <section id="contato" className="py-20 bg-accent/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Fale com a gente</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tem alguma dúvida ou quer ajuda para escolher a solução certa?
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Envie sua mensagem</CardTitle>
              <CardDescription>Nossa equipe responderá o mais breve possível.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="nome" className="text-sm font-medium">
                    Nome
                  </label>
                  <Input id="nome" placeholder="Seu nome completo" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    E-mail
                  </label>
                  <Input id="email" type="email" placeholder="seu@email.com" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="mensagem" className="text-sm font-medium">
                    Mensagem
                  </label>
                  <Textarea id="mensagem" placeholder="Como podemos ajudar?" rows={4} />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full">Enviar mensagem</Button>
              <Button variant="outline" className="w-full flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Falar pelo WhatsApp
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}
