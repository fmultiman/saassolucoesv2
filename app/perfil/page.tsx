"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, User, Briefcase, MapPin, Mail } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { AvatarUpload } from "@/components/avatar-upload"
import { EmailChangeForm } from "@/components/email-change-form"

export default function PerfilPage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>({
    full_name: "",
    bio: "",
    phone: "",
    location: "",
    website: "",
    company: "",
    job_title: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  })
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("personal")

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
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", session.user.id)
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
        user_id: user.id,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Seu Perfil</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Pessoal</span>
          </TabsTrigger>
          <TabsTrigger value="professional" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Profissional</span>
          </TabsTrigger>
          <TabsTrigger value="address" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Endereço</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Email</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais e como você aparece para outros usuários.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarUrl || ""} alt={profile.full_name} />
                    <AvatarFallback>{profile.full_name?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <AvatarUpload onUploadComplete={handleAvatarUploaded} />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="full_name">Nome completo</Label>
                      <Input id="full_name" name="full_name" value={profile.full_name || ""} onChange={handleChange} />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="bio">Biografia</Label>
                      <Textarea id="bio" name="bio" value={profile.bio || ""} onChange={handleChange} rows={4} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" name="phone" value={profile.phone || ""} onChange={handleChange} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="location">Localização</Label>
                  <Input id="location" name="location" value={profile.location || ""} onChange={handleChange} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar alterações"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="professional">
          <Card>
            <CardHeader>
              <CardTitle>Informações Profissionais</CardTitle>
              <CardDescription>Atualize suas informações profissionais e de trabalho.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="job_title">Cargo</Label>
                  <Input id="job_title" name="job_title" value={profile.job_title || ""} onChange={handleChange} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input id="company" name="company" value={profile.company || ""} onChange={handleChange} />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={profile.website || ""}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar alterações"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="address">
          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
              <CardDescription>Atualize seu endereço e informações de localização.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="address">Endereço</Label>
                <Input id="address" name="address" value={profile.address || ""} onChange={handleChange} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" name="city" value={profile.city || ""} onChange={handleChange} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input id="state" name="state" value={profile.state || ""} onChange={handleChange} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="postal_code">CEP</Label>
                  <Input
                    id="postal_code"
                    name="postal_code"
                    value={profile.postal_code || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="country">País</Label>
                  <Input id="country" name="country" value={profile.country || ""} onChange={handleChange} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar alterações"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Email</CardTitle>
              <CardDescription>Gerencie seu email e configurações de conta.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label>Email atual</Label>
                <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user?.email}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Alterar Email</h3>
                <EmailChangeForm currentEmail={user?.email} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
