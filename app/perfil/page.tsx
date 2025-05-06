"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, User, Briefcase, MapPin, Mail } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { AvatarUpload } from "@/components/avatar-upload"
import { ProfileForm } from "@/components/profile-form"
import { useCurrentUser } from "@/hooks/use-current-user"
import { createClient } from "@/lib/supabase/client" // ✅ NOVO
const supabase = createClient() // ✅ NOVO
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"

// Interface baseada nos campos mais comuns de perfis SaaS
export interface Profile {
  id?: string
  name?: string
  email?: string
  bio?: string
  phone?: string
  job_title?: string
  company?: string
  website?: string
  location?: string
  avatar_url?: string
  preferences?: Record<string, any>
  company_name?: string
  company_size?: string
  industry?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postal_code?: string
  social_links?: Record<string, string>
  created_at?: string
  updated_at?: string
}

export default function PerfilPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push("/login")
          return
        }

        setUser(session.user)

        // Carregar perfil do usuário
        console.log("USER ID:", session.user.id)

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (profileError && profileError.code !== "PGRST116") {
          console.error("Erro ao carregar perfil:", profileError)
          toast({
            title: "Erro ao carregar perfil",
            description: "Não foi possível carregar seus dados de perfil.",
            variant: "destructive",
          })
        }

        if (profileData) {
          setProfile(profileData)

          // Carregar avatar se existir
          if (profileData.avatar_url) {
            setAvatarUrl(profileData.avatar_url)
          }
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error)
        toast({
          title: "Erro ao carregar dados",
          description: "Ocorreu um erro ao carregar seus dados.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [supabase, router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        updated_at: new Date().toISOString(),
        ...profile,
      })

      if (error) throw error

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      })
    } catch (error: any) {
      console.error("Erro ao salvar perfil:", error)
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar suas informações.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUploaded = (url: string) => {
    setAvatarUrl(url)
    setProfile((prev) => ({ ...prev, avatar_url: url }))
  }

  const handleChangePassword = async () => {
    setIsChangingPassword(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso.",
      })
    } catch (error: any) {
      console.error("Erro ao alterar senha:", error)
      toast({
        title: "Erro ao alterar senha",
        description: error.message || "Não foi possível alterar sua senha.",
        variant: "destructive",
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
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
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden transition-all duration-300 md:ml-64">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <h1 className="text-3xl font-bold mb-6">Seu Perfil</h1>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>Atualize suas informações pessoais</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm profile={profile} onUpdateProfile={handleSave} isAdmin={false} userEmail={user?.email} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>Gerencie suas credenciais de acesso</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button onClick={handleChangePassword} disabled={isChangingPassword}>
                  {isChangingPassword ? "Alterando..." : "Alterar Senha"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
