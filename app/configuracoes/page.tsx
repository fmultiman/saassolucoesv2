"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Moon, Globe } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ConfiguracoesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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
              <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
              <p className="text-muted-foreground">Gerencie suas preferências e configurações da conta.</p>
            </div>

            <Tabs defaultValue="geral">
              <TabsList>
                <TabsTrigger value="geral">Geral</TabsTrigger>
                <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
                <TabsTrigger value="seguranca">Segurança</TabsTrigger>
                <TabsTrigger value="integracao">Integrações</TabsTrigger>
              </TabsList>
              <TabsContent value="geral" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Aparência</CardTitle>
                    <CardDescription>Personalize a aparência da plataforma</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        <Label htmlFor="dark-mode">Modo Escuro</Label>
                      </div>
                      <Switch id="dark-mode" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <Label htmlFor="language">Idioma</Label>
                      </div>
                      <Select defaultValue="pt-BR">
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                          <SelectItem value="en-US">English (US)</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Preferências do Dashboard</CardTitle>
                    <CardDescription>Configure como o dashboard é exibido</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-metrics">Mostrar métricas na página inicial</Label>
                      <Switch id="show-metrics" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-recommendations">Mostrar recomendações</Label>
                      <Switch id="show-recommendations" defaultChecked />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Salvar Preferências</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="notificacoes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Notificações</CardTitle>
                    <CardDescription>Configure como e quando receber notificações</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Notificações por Email</p>
                        <p className="text-sm text-muted-foreground">Receba atualizações por email</p>
                      </div>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Notificações no Aplicativo</p>
                        <p className="text-sm text-muted-foreground">Receba notificações na plataforma</p>
                      </div>
                      <Switch id="app-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Alertas de Desempenho</p>
                        <p className="text-sm text-muted-foreground">Seja notificado sobre mudanças significativas</p>
                      </div>
                      <Switch id="performance-alerts" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Novidades e Atualizações</p>
                        <p className="text-sm text-muted-foreground">Receba informações sobre novos recursos</p>
                      </div>
                      <Switch id="news-updates" defaultChecked />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Salvar Preferências</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="seguranca" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Segurança da Conta</CardTitle>
                    <CardDescription>Gerencie as configurações de segurança da sua conta</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Senha Atual</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nova Senha</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Alterar Senha</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Autenticação de Dois Fatores</CardTitle>
                    <CardDescription>Adicione uma camada extra de segurança à sua conta</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Autenticação de Dois Fatores</p>
                        <p className="text-sm text-muted-foreground">Proteja sua conta com 2FA</p>
                      </div>
                      <Switch id="2fa" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline">Configurar 2FA</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="integracao" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Integrações</CardTitle>
                    <CardDescription>Conecte a plataforma com outros serviços</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-md bg-muted p-2">
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
                              fill="#25D366"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">WhatsApp Business</p>
                          <p className="text-sm text-muted-foreground">Conecte sua conta do WhatsApp Business</p>
                        </div>
                      </div>
                      <Button variant="outline">Conectar</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-md bg-muted p-2">
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
                              fill="#1877F2"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Facebook</p>
                          <p className="text-sm text-muted-foreground">Conecte sua página do Facebook</p>
                        </div>
                      </div>
                      <Button variant="outline">Conectar</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-md bg-muted p-2">
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
                              fill="#E4405F"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Instagram</p>
                          <p className="text-sm text-muted-foreground">Conecte sua conta do Instagram</p>
                        </div>
                      </div>
                      <Button variant="outline">Conectar</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>API e Webhooks</CardTitle>
                    <CardDescription>Configure integrações avançadas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="api-key">Chave de API</Label>
                        <div className="flex gap-2">
                          <Input id="api-key" type="password" value="••••••••••••••••••••••" readOnly />
                          <Button variant="outline">Copiar</Button>
                          <Button variant="outline">Regenerar</Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="webhook-url">URL do Webhook</Label>
                        <Input id="webhook-url" placeholder="https://seu-dominio.com/webhook" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Salvar Configurações</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
