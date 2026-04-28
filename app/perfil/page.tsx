"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { ProfileForm } from "@/components/profile-form"
import { ChangePasswordBlock } from "@/components/change-password-block"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"

export default function PerfilPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { user, profile, loading, updateProfile, refreshProfile } = useCurrentUser()

  const handleSave = async (data: Record<string, unknown>): Promise<{ success?: boolean; error?: Error }> => {
    const normalizedData = { ...data }

    if ("company_name" in normalizedData) {
      normalizedData.company = normalizedData.company_name
    }

    const result = (await updateProfile(normalizedData)) as { success?: boolean; error?: Error }

    if ("company_name" in normalizedData) {
      await refreshProfile()
    }

    if (result?.error) {
      toast({
        title: "Erro ao salvar",
        description: result.error.message,
        variant: "destructive",
      })

      return { error: result.error }
    }

    toast({
      title: "Perfil atualizado",
      description: "Suas informacoes foram salvas com sucesso.",
    })

    return { success: true }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-4">
        <p className="text-lg font-medium text-muted-foreground">Nenhum perfil encontrado.</p>
        <Button variant="outline" onClick={() => router.refresh()}>
          Tentar novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${sidebarCollapsed ? "md:ml-[70px]" : "md:ml-64"}`}
      >
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <h1 className="text-3xl font-bold mb-6">Seu Perfil</h1>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Informacoes Pessoais</CardTitle>
                  <CardDescription>Atualize suas informacoes pessoais</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileForm profile={profile} onUpdateProfile={handleSave} isAdmin={false} userEmail={user.email} />
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Seguranca</CardTitle>
                  <CardDescription>Gerencie suas credenciais de acesso</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ChangePasswordBlock user={user} />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
