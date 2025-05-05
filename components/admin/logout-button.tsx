"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Loader2 } from "lucide-react"
import { createClient, clearSupabaseClient } from "@/lib/supabase/client"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function LogoutButton({ variant = "ghost", size = "sm", className }: LogoutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    if (isLoading) return
    setIsLoading(true)

    const supabase = createClient()

    try {
      console.log("Iniciando processo de logout")

      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("Erro ao fazer logout:", error)
        throw error
      }

      // Limpa singleton
      clearSupabaseClient()

      console.log("Logout bem-sucedido")

      // Redireciona e atualiza
      router.push("/")
      router.refresh()

      // Refresco final
      setTimeout(() => {
        window.location.href = "/"
      }, 100)
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleLogout} variant={variant} size={size} className={className} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Saindo...</span>
        </>
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </>
      )}
    </Button>
  )
}
