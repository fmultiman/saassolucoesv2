"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Moon, Globe, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCurrentUser } from "@/hooks/use-current-user"

type UserPreferences = {
  dark_mode?: boolean
  language?: string
  show_metrics?: boolean
  show_recommendations?: boolean
  email_notifications?: boolean
  app_notifications?: boolean
  performance_alerts?: boolean
  news_updates?: boolean
  webhook_url?: string
}

export default function ConfiguracoesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { profile, loading, updateProfile } = useCurrentUser()
  const router = useRouter()

  const [darkMode, setDarkMode] = useState(true)
  const [language, setLanguage] = useState("pt-BR")
  const [showMetrics, setShowMetrics] = useState(true)
  const [showRecommendations, setShowRecommendations] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [appNotifications, setAppNotifications] = useState(true)
  const [performanceAlerts, setPerformanceAlerts] = useState(true)
  const [newsUpdates, setNewsUpdates] = useState(true)
  const [webhookUrl, setWebhookUrl] = useState("")
  const [savingGeneral, setSavingGeneral] = useState(false)
  const [savingNotifications, setSavingNotifications] = useState(false)
  const [savingIntegration, setSavingIntegration] = useState(false)

  useEffect(() => {
    const preferences = (profile?.preferences as UserPreferences | null) || null

    setDarkMode(preferences?.dark_mode ?? true)
    setLanguage(preferences?.language || "pt-BR")
    setShowMetrics(preferences?.show_metrics ?? true)
    setShowRecommendations(preferences?.show_recommendations ?? true)
    setEmailNotifications(preferences?.email_notifications ?? true)
    setAppNotifications(preferences?.app_notifications ?? true)
    setPerformanceAlerts(preferences?.performance_alerts ?? true)
    setNewsUpdates(preferences?.news_updates ?? true)
    setWebhookUrl(preferences?.webhook_url || "")
  }, [profile])

  const buildPreferences = (): UserPreferences => {
    const currentPreferences =
      profile?.preferences && typeof profile.preferences === "object"
        ? (profile.preferences as UserPreferences)
        : {}

    return {
      ...currentPreferences,
      dark_mode: darkMode,
      language,
      show_metrics: showMetrics,
      show_recommendations: showRecommendations,
      email_notifications: emailNotifications,
      app_notifications: appNotifications,
      performance_alerts: performanceAlerts,
      news_updates: newsUpdates,
      webhook_url: webhookUrl,
    }
  }

  const saveGeneral = async () => {
    setSavingGeneral(true)
    try {
      await updateProfile({ preferences: buildPreferences() })
    } catch (saveError) {
      console.error("Erro ao salvar configuracoes gerais:", saveError)
    } finally {
      setSavingGeneral(false)
    }
  }

  const saveNotifications = async () => {
    setSavingNotifications(true)
    try {
      await updateProfile({ preferences: buildPreferences() })
    } catch (saveError) {
      console.error("Erro ao salvar notificacoes:", saveError)
    } finally {
      setSavingNotifications(false)
    }
  }

  const saveIntegration = async () => {
    setSavingIntegration(true)
    try {
      await updateProfile({ preferences: buildPreferences() })
    } catch (saveError) {
      console.error("Erro ao salvar integracoes:", saveError)
    } finally {
      setSavingIntegration(false)
    }
  }

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
              <h1 className="text-3xl font-bold tracking-tight">Configuracoes</h1>
              <p className="text-muted-foreground">Gerencie suas preferencias e configuracoes da conta.</p>
            </div>

            <Tabs defaultValue="geral">
              <TabsList>
                <TabsTrigger value="geral">Geral</TabsTrigger>
                <TabsTrigger value="notificacoes">Notificacoes</TabsTrigger>
                <TabsTrigger value="seguranca">Seguranca</TabsTrigger>
                <TabsTrigger value="integracao">Integracoes</TabsTrigger>
              </TabsList>
              <TabsContent value="geral" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Aparencia</CardTitle>
                    <CardDescription>Personalize a aparencia da plataforma</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        <Label htmlFor="dark-mode">Modo Escuro</Label>
                      </div>
                      <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} disabled={loading} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <Label htmlFor="language">Idioma</Label>
                      </div>
                      <Select value={language} onValueChange={setLanguage} disabled={loading}>
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
                    <CardTitle>Preferencias do Dashboard</CardTitle>
                    <CardDescription>Configure como o dashboard e exibido</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-metrics">Mostrar metricas na pagina inicial</Label>
                      <Switch id="show-metrics" checked={showMetrics} onCheckedChange={setShowMetrics} disabled={loading} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-recommendations">Mostrar recomendacoes</Label>
                      <Switch
                        id="show-recommendations"
                        checked={showRecommendations}
                        onCheckedChange={setShowRecommendations}
                        disabled={loading}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={saveGeneral} disabled={savingGeneral || loading}>
                      {savingGeneral ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        "Salvar Preferencias"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="notificacoes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Notificacoes</CardTitle>
                    <CardDescription>Configure como e quando receber notificacoes</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Notificacoes por Email</p>
                        <p className="text-sm text-muted-foreground">Receba atualizacoes por email</p>
                      </div>
                      <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} disabled={loading} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Notificacoes no Aplicativo</p>
                        <p className="text-sm text-muted-foreground">Receba notificacoes na plataforma</p>
                      </div>
                      <Switch id="app-notifications" checked={appNotifications} onCheckedChange={setAppNotifications} disabled={loading} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Alertas de Desempenho</p>
                        <p className="text-sm text-muted-foreground">Seja notificado sobre mudancas significativas</p>
                      </div>
                      <Switch id="performance-alerts" checked={performanceAlerts} onCheckedChange={setPerformanceAlerts} disabled={loading} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Novidades e Atualizacoes</p>
                        <p className="text-sm text-muted-foreground">Receba informacoes sobre novos recursos</p>
                      </div>
                      <Switch id="news-updates" checked={newsUpdates} onCheckedChange={setNewsUpdates} disabled={loading} />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={saveNotifications} disabled={savingNotifications || loading}>
                      {savingNotifications ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        "Salvar Preferencias"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="seguranca" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Seguranca da Conta</CardTitle>
                    <CardDescription>Gerencie as configuracoes de seguranca da sua conta</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Senha Atual</Label>
                      <Input id="current-password" type="password" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nova Senha</Label>
                      <Input id="new-password" type="password" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                      <Input id="confirm-password" type="password" disabled />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => router.push("/perfil")}>Alterar Senha</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Autenticacao de Dois Fatores</CardTitle>
                    <CardDescription>Adicione uma camada extra de seguranca a sua conta</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Autenticacao de Dois Fatores</p>
                        <p className="text-sm text-muted-foreground">Proteja sua conta com 2FA</p>
                      </div>
                      <Switch id="2fa" disabled />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" disabled>
                      Configurar 2FA
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="integracao" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Integracoes</CardTitle>
                    <CardDescription>Conecte a plataforma com outros servicos</CardDescription>
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
                      <Button variant="outline" disabled>
                        Conectar
                      </Button>
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
                          <p className="text-sm text-muted-foreground">Conecte sua pagina do Facebook</p>
                        </div>
                      </div>
                      <Button variant="outline" disabled>
                        Conectar
                      </Button>
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
                      <Button variant="outline" disabled>
                        Conectar
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>API e Webhooks</CardTitle>
                    <CardDescription>Configure integracoes avancadas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="api-key">Chave de API</Label>
                        <div className="flex gap-2">
                          <Input id="api-key" type="password" value="Nao configurada nesta tela" readOnly />
                          <Button variant="outline" disabled>
                            Copiar
                          </Button>
                          <Button variant="outline" disabled>
                            Regenerar
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="webhook-url">URL do Webhook</Label>
                        <Input id="webhook-url" placeholder="https://seu-dominio.com/webhook" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={saveIntegration} disabled={savingIntegration || loading}>
                      {savingIntegration ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        "Salvar Configuracoes"
                      )}
                    </Button>
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
