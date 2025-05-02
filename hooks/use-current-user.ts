"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/types"

type UserWithProfile = User & {
  user_type?: string
  profile?: Database["public"]["Tables"]["profiles"]["Row"] | null
}

export function useCurrentUser() {
  const [user, setUser] = useState<UserWithProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const supabase = createClient()

        // Obter a sessão atual
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          throw sessionError
        }

        if (!session) {
          setUser(null)
          return
        }

        // Obter dados do usuário da tabela users
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("user_type")
          .eq("id", session.user.id)
          .single()

        if (userError && userError.code !== "PGRST116") {
          // Ignorar erro de não encontrado
          console.warn("Erro ao buscar tipo de usuário:", userError)
        }

        // Obter perfil do usuário
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (profileError && profileError.code !== "PGRST116") {
          // Ignorar erro de não encontrado
          console.warn("Erro ao buscar perfil:", profileError)
        }

        // Combinar dados
        const enhancedUser: UserWithProfile = {
          ...session.user,
          user_type: userData?.user_type,
          profile: profileData || null,
        }

        setUser(enhancedUser)
      } catch (err) {
        console.error("Erro ao buscar usuário:", err)
        setError(err instanceof Error ? err : new Error(String(err)))
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    // Configurar listener para mudanças de autenticação
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUser()
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { user, loading, error }
}

export default useCurrentUser
