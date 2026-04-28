"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { ProfileForm } from "@/components/profile-form"
import { Skeleton } from "@/components/ui/skeleton"
import { ChangePasswordBlock } from "@/components/change-password-block";
import { supabase } from "@/lib/supabase/client"

export default function AdminProfilePage() {
  const { user, loading, error, updateProfile, refreshProfile, checkSession, refreshSession } = useCurrentUser()
  const profile = user?.profile
  const { toast } = useToast()
  const router = useRouter()

  // Verificar periodicamente se a sessão ainda é válida
  useEffect(() => {
    const sessionCheckInterval = setInterval(async () => {
      const isSessionValid = await checkSession()

      if (!isSessionValid) {
        console.log("Sessão expirada, tentando renovar...")
        const renewed = await refreshSession()

        if (!renewed) {
          console.log("Não foi possível renovar a sessão, redirecionando para login...")
          router.push("/login/admin")
        } else {
          console.log("Sessão renovada com sucesso")
        }
      }
    }, 30000) // Verificar a cada 30 segundos

    return () => clearInterval(sessionCheckInterval)
  }, [checkSession, refreshSession, router])

  // Não mostrar nada se não houver usuário e não estiver carregando (logout)
  if (!user && !loading) {
    router.push("/login/admin")
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Perfil do Administrador</h2>
            <p className="text-muted-foreground">Erro ao carregar informações do perfil.</p>
          </div>
          <Button onClick={refreshProfile} variant="outline">
            Recarregar Página
          </Button>
        </div>
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <p>
            Ocorreu um erro ao carregar as informações do perfil. Tente atualizar a página ou fazer login novamente.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Perfil do Administrador</h2>
        <p className="text-muted-foreground">Gerencie suas informações pessoais e preferências.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Atualize suas informações pessoais</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Skeleton className="h-32 w-32 rounded-full" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ) : profile ? (
                <ProfileForm profile={profile} onUpdateProfile={updateProfile} isAdmin={true} userEmail={user?.email} />
              ) : (
                <p>Nenhum perfil encontrado. Faça login para visualizar seu perfil.</p>
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>Gerencie suas credenciais de acesso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ChangePasswordBlock user={user} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
