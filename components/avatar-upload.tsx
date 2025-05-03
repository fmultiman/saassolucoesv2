"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"

interface AvatarUploadProps {
  currentAvatarUrl: string | null
  userId: string
  onAvatarChange: (url: string | null) => void
  size?: "sm" | "md" | "lg" | "xl"
}

const sizeClasses = {
  sm: "h-10 w-10",
  md: "h-16 w-16",
  lg: "h-24 w-24",
  xl: "h-32 w-32",
}

export function AvatarUpload({ currentAvatarUrl, userId, onAvatarChange, size = "md" }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [localUserId, setLocalUserId] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Garantir que temos o userId disponível
  useEffect(() => {
    console.log("AvatarUpload - userId recebido:", userId)
    if (userId) {
      setLocalUserId(userId)
    } else {
      // Tentar obter o userId da sessão se não for fornecido como prop
      const getUserId = async () => {
        const { data } = await supabase.auth.getSession()
        if (data.session?.user?.id) {
          console.log("AvatarUpload - userId obtido da sessão:", data.session.user.id)
          setLocalUserId(data.session.user.id)
        }
      }
      getUserId()
    }
  }, [userId, supabase])

  // Função para configurar o storage antes do upload
  const setupStorage = async () => {
    try {
      const response = await fetch("/api/storage/setup", {
        method: "POST",
      })
      return await response.json()
    } catch (error) {
      console.error("Erro ao configurar storage:", error)
      return null
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione uma imagem.",
      })
      return
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 5MB.",
      })
      return
    }

    setIsUploading(true)

    try {
      // Verificar se temos um ID de usuário válido
      const effectiveUserId = localUserId || userId

      if (!effectiveUserId) {
        console.error("ID do usuário não disponível:", { localUserId, propUserId: userId })
        throw new Error("ID do usuário não disponível. Não é possível fazer upload do avatar.")
      }

      // Configurar storage antes do upload
      await setupStorage()

      // Gerar nome de arquivo único
      const fileExt = file.name.split(".").pop()
      const fileName = `${effectiveUserId}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      console.log("Iniciando upload do avatar:", filePath)
      console.log("ID do usuário efetivo:", effectiveUserId)

      // Fazer upload para o Supabase Storage
      const { data, error } = await supabase.storage.from("user-content").upload(filePath, file, {
        cacheControl: "3600",
        upsert: true, // Alterado para true para sobrescrever se necessário
      })

      if (error) {
        console.error("Erro ao fazer upload do avatar:", error)
        setUploadError(error.message)
        throw error
      }

      // Obter URL pública
      const { data: urlData } = supabase.storage.from("user-content").getPublicUrl(filePath)

      // Atualizar URL do avatar
      onAvatarChange(urlData.publicUrl)

      toast({
        title: "Avatar atualizado",
        description: "Seu avatar foi atualizado com sucesso.",
      })
    } catch (error: any) {
      console.error("Erro ao fazer upload do avatar:", error)
      setUploadError(error.message || "Erro desconhecido")
      toast({
        variant: "destructive",
        title: "Erro ao atualizar avatar",
        description: error.message || "Ocorreu um erro ao fazer upload do avatar.",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  // Extrair iniciais do nome do usuário para o fallback
  const getInitials = () => {
    return "U"
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <Avatar className={`${sizeClasses[size]} border-2 border-primary/10`}>
          <AvatarImage src={currentAvatarUrl || ""} alt="Avatar do usuário" />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-md"
          onClick={handleButtonClick}
          disabled={isUploading || !localUserId}
        >
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
        </Button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={isUploading}
      />
      {!localUserId && <p className="text-xs text-red-500 mt-1">ID do usuário não disponível. Recarregue a página.</p>}
      {uploadError && <p className="text-xs text-red-500 mt-1">Erro: {uploadError}</p>}
    </div>
  )
}
