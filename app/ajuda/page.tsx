"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Search, Book, MessageSquare, FileText, ExternalLink, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function AjudaPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const faqItems = [
    {
      question: "Como adicionar uma nova solução?",
      answer:
        "Para adicionar uma nova solução, acesse a página 'Soluções Inteligentes', escolha a solução desejada e clique no botão 'Ativar'. Você será guiado pelo processo de configuração específico para aquela solução.",
    },
    {
      question: "Como personalizar as automações?",
      answer:
        "Após ativar uma solução, você pode personalizá-la acessando a página 'Minhas Soluções', selecionando a solução desejada e clicando em 'Editar'. Lá você encontrará todas as opções de personalização disponíveis.",
    },
    {
      question: "Como interpretar as métricas de desempenho?",
      answer:
        "As métricas de desempenho mostram indicadores importantes como taxa de engajamento, tempo economizado e automações ativas. Você pode obter análises mais detalhadas na página 'Desempenho e Métricas'.",
    },
    {
      question: "Como alterar meu plano de assinatura?",
      answer:
        "Para alterar seu plano, acesse a página 'Minha Assinatura', onde você verá os planos disponíveis e poderá fazer upgrade ou downgrade conforme necessário.",
    },
    {
      question: "Como integrar com outras plataformas?",
      answer:
        "Acesse a página 'Configurações' e selecione a aba 'Integrações'. Lá você encontrará todas as plataformas disponíveis para integração e poderá conectá-las seguindo as instruções específicas.",
    },
  ]

  const tutoriais = [
    {
      titulo: "Primeiros passos com a plataforma",
      descricao: "Aprenda o básico para começar a usar a plataforma",
      icone: Book,
      cor: "bg-blue-500/10 text-blue-500",
    },
    {
      titulo: "Configurando sua primeira automação",
      descricao: "Tutorial passo a passo para criar automações",
      icone: MessageSquare,
      cor: "bg-green-500/10 text-green-500",
    },
    {
      titulo: "Analisando métricas de desempenho",
      descricao: "Como interpretar e utilizar os dados de desempenho",
      icone: FileText,
      cor: "bg-purple-500/10 text-purple-500",
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${sidebarCollapsed ? "md:ml-[70px]" : "md:ml-64"}`}
      >
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Central de Ajuda</h1>
              <p className="text-muted-foreground">
                Encontre respostas para suas dúvidas e aprenda a usar a plataforma.
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Buscar ajuda..." className="pl-10 py-6 text-lg" />
            </div>

            <Tabs defaultValue="faq">
              <TabsList>
                <TabsTrigger value="faq">Perguntas Frequentes</TabsTrigger>
                <TabsTrigger value="tutoriais">Tutoriais</TabsTrigger>
                <TabsTrigger value="suporte">Suporte</TabsTrigger>
              </TabsList>
              <TabsContent value="faq" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Perguntas Frequentes</CardTitle>
                    <CardDescription>Respostas para as dúvidas mais comuns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {faqItems.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                          <AccordionContent>{item.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                  <CardFooter>
                    <Button variant="link" className="mx-auto">
                      Ver todas as perguntas frequentes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="tutoriais" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  {tutoriais.map((tutorial, index) => (
                    <Card key={index} className="flex flex-col">
                      <CardHeader>
                        <div className={`rounded-md p-2 w-fit ${tutorial.cor}`}>
                          <tutorial.icone className="h-5 w-5" />
                        </div>
                        <CardTitle className="mt-4">{tutorial.titulo}</CardTitle>
                        <CardDescription>{tutorial.descricao}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <div className="h-32 rounded-md bg-accent/50 flex items-center justify-center">
                          <span className="text-sm text-muted-foreground">Prévia do tutorial</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">
                          Ver Tutorial
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Biblioteca de Vídeos</CardTitle>
                    <CardDescription>Tutoriais em vídeo para aprender a usar a plataforma</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="aspect-video rounded-md bg-accent/50 flex items-center justify-center">
                        <span className="text-muted-foreground">Vídeo Tutorial 1</span>
                      </div>
                      <div className="aspect-video rounded-md bg-accent/50 flex items-center justify-center">
                        <span className="text-muted-foreground">Vídeo Tutorial 2</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="link" className="mx-auto">
                      Ver todos os vídeos
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="suporte" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Entre em Contato</CardTitle>
                    <CardDescription>Nossa equipe está pronta para ajudar</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Chat ao Vivo</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Converse em tempo real com nossa equipe de suporte.
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Iniciar Chat
                          </Button>
                        </CardFooter>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Email</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Envie sua dúvida e responderemos em até 24 horas.
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" className="w-full">
                            suporte@saassolucoes.com.br
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Base de Conhecimento</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Acesse nossa documentação completa com guias detalhados e exemplos.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Acessar Base de Conhecimento
                        </Button>
                      </CardFooter>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
