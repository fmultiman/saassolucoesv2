"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { User, Mail, Phone, Building, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useRouter } from "next/navigation"
import { Loader2, RefreshCw } from "lucide-react"
import { AvatarUpload } from "@/components/avatar-upload"

export default function ContaPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { profile, loading, error, updateProfile, refreshProfile } = useCurrentUser()
  const [name, setName] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (profile) {
      setName(profile.name || "")
    }
  }, [profile])

  const handleRefreshProfile = async () => {
    setIsRefreshing(true)
    try {
      await refreshProfile()
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!profile) return

    setIsSaving(true)
    try {
      await updateProfile({ name })
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-x-hidden">
      <Sidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${sidebarCollapsed ? "md:ml-[70px]" : "md:ml-64"}`}
      >
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 overflow-x-hidden">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Minha Conta</h1>
              <p className="text-muted-foreground">Gerencie suas informações pessoais e preferências.</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error || !profile ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Erro</h2>
                    <p className="text-muted-foreground">Erro ao carregar informações do perfil.</p>
                  </div>
                  <Button onClick={handleRefreshProfile} disabled={isRefreshing}>
                    {isRefreshing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Atualizar
                  </Button>
                </div>
                <div className="bg-destructive/10 text-destructive p-4 rounded-md">
                  <p>
                    Ocorreu um erro ao carregar as informações do perfil. Tente atualizar a página ou fazer login
                    novamente.
                  </p>
                </div>
              </div>
            ) : (
              <Tabs defaultValue="perfil">
                <TabsList>
                  <TabsTrigger value="perfil">Perfil</TabsTrigger>
                  <TabsTrigger value="empresa">Empresa</TabsTrigger>
                  <TabsTrigger value="preferencias">Preferências</TabsTrigger>
                </TabsList>
                <TabsContent value="perfil" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informações Pessoais</CardTitle>
                      <CardDescription>Atualize suas informações pessoais</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
                        <AvatarUpload
                          currentAvatarUrl={profile.avatar_url}
                          userId={profile.id}
                          onAvatarChange={(url) => updateProfile({ avatar_url: url })}
                          size="lg"
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="nome">Nome</Label>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <Input id="nome" value={name} onChange={(e) => setName(e.target.value)} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <Input id="email" type="email" value={profile.email || ""} disabled />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="telefone">Telefone</Label>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <Input id="telefone" placeholder="Adicione seu telefone" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cargo">Cargo</Label>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <Input id="cargo" placeholder="Seu cargo na empresa" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={handleSaveProfile} disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          "Salvar Alterações"
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="empresa" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informações da Empresa</CardTitle>
                      <CardDescription>Atualize os dados da sua empresa</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="empresa">Nome da Empresa</Label>
                        <Input id="empresa" placeholder="Nome da sua empresa" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="segmento">Segmento</Label>
                        <Input id="segmento" placeholder="Segmento de atuação" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="site">Site</Label>
                        <Input id="site" placeholder="https://www.seusite.com.br" />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="endereco">Endereço</Label>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <Input id="endereco" placeholder="Endereço da empresa" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cidade">Cidade</Label>
                          <Input id="cidade" placeholder="Cidade" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="estado">Estado</Label>
                          <Input id="estado" placeholder="Estado" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cep">CEP</Label>
                          <Input id="cep" placeholder="00000-000" />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Salvar Alterações</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="preferencias" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Preferências de Comunicação</CardTitle>
                      <CardDescription>Configure como deseja receber comunicações</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="bio">Biografia</Label>
                        <Textarea id="bio" placeholder="Conte um pouco sobre você..." className="min-h-32" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="idioma">Idioma Preferido</Label>
                        <select
                          id="idioma"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="pt-BR">Português (Brasil)</option>
                          <option value="en-US">English (US)</option>
                          <option value="es">Español</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fuso">Fuso Horário</Label>
                        <select
                          id="fuso"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                          <option value="America/New_York">New York (GMT-4)</option>
                          <option value="Europe/London">London (GMT+1)</option>
                        </select>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Salvar Preferências</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
