"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Check, CreditCard, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AssinaturaPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const planos = [
    {
      nome: "Básico",
      preco: "R$ 99",
      periodo: "/mês",
      descricao: "Para pequenos negócios começando com automação",
      recursos: ["2 soluções ativas", "500 interações/mês", "Suporte por email", "Atualizações básicas"],
      destaque: false,
      botao: "Fazer Downgrade",
      desabilitado: true,
    },
    {
      nome: "Pro",
      preco: "R$ 249",
      periodo: "/mês",
      descricao: "Para negócios em crescimento que precisam de mais recursos",
      recursos: [
        "5 soluções ativas",
        "3.000 interações/mês",
        "Suporte prioritário",
        "Todas as atualizações",
        "Relatórios avançados",
      ],
      destaque: true,
      botao: "Plano Atual",
      desabilitado: true,
    },
    {
      nome: "Enterprise",
      preco: "R$ 599",
      periodo: "/mês",
      descricao: "Para empresas que precisam de recursos avançados e personalização",
      recursos: [
        "Soluções ilimitadas",
        "10.000 interações/mês",
        "Suporte 24/7",
        "Recursos exclusivos",
        "API completa",
        "Personalização avançada",
      ],
      destaque: false,
      botao: "Fazer Upgrade",
      desabilitado: false,
    },
  ]

  const faturas = [
    {
      id: "INV-001",
      data: "01/04/2023",
      valor: "R$ 249,00",
      status: "Pago",
    },
    {
      id: "INV-002",
      data: "01/03/2023",
      valor: "R$ 249,00",
      status: "Pago",
    },
    {
      id: "INV-003",
      data: "01/02/2023",
      valor: "R$ 249,00",
      status: "Pago",
    },
    {
      id: "INV-004",
      data: "01/01/2023",
      valor: "R$ 199,00",
      status: "Pago",
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
              <h1 className="text-3xl font-bold tracking-tight">Minha Assinatura</h1>
              <p className="text-muted-foreground">Gerencie seu plano e veja seu histórico de pagamentos.</p>
            </div>

            <Tabs defaultValue="planos">
              <TabsList>
                <TabsTrigger value="planos">Planos</TabsTrigger>
                <TabsTrigger value="faturas">Faturas</TabsTrigger>
                <TabsTrigger value="metodos">Métodos de Pagamento</TabsTrigger>
              </TabsList>
              <TabsContent value="planos" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  {planos.map((plano, index) => (
                    <Card key={index} className={`flex flex-col ${plano.destaque ? "border-primary shadow-md" : ""}`}>
                      {plano.destaque && (
                        <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                          Plano Atual
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
                          disabled={plano.desabilitado}
                        >
                          {plano.botao}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Detalhes da Assinatura</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Plano Atual</p>
                        <p className="text-lg">Pro</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Próxima Cobrança</p>
                        <p className="text-lg">01/05/2023</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Valor</p>
                        <p className="text-lg">R$ 249,00</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Status</p>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                          Ativo
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancelar Assinatura</Button>
                    <Button>Gerenciar Plano</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="faturas">
                <Card>
                  <CardHeader>
                    <CardTitle>Histórico de Faturas</CardTitle>
                    <CardDescription>Veja suas faturas anteriores e faça o download dos comprovantes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-4 bg-muted/50 p-3 text-sm font-medium">
                        <div>Fatura</div>
                        <div>Data</div>
                        <div>Valor</div>
                        <div>Status</div>
                      </div>
                      {faturas.map((fatura, index) => (
                        <div key={index} className="grid grid-cols-4 items-center border-t p-3 text-sm">
                          <div>{fatura.id}</div>
                          <div>{fatura.data}</div>
                          <div>{fatura.valor}</div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-green-500/10 text-green-500">
                              {fatura.status}
                            </Badge>
                            <Button variant="ghost" size="icon" title="Download">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="metodos">
                <Card>
                  <CardHeader>
                    <CardTitle>Métodos de Pagamento</CardTitle>
                    <CardDescription>Gerencie seus cartões e formas de pagamento</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-md border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-md bg-muted p-2">
                            <CreditCard className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">Mastercard terminando em 4321</p>
                            <p className="text-sm text-muted-foreground">Expira em 12/2025</p>
                          </div>
                        </div>
                        <Badge>Padrão</Badge>
                      </div>
                    </div>
                    <Button className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Adicionar Novo Método de Pagamento
                    </Button>
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
