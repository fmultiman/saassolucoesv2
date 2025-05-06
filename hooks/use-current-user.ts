"use client"

import { useEffect, useState, useCallback } from "react"
import { supabase } from "@/lib/supabase/client"
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

  // 🔄 Atualizar perfil manualmente
  const refreshProfile = useCallback(async () => {
    if (!user) return
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (!profileError) {
      setUser((prev) =>
        prev ? { ...prev, profile: profileData || null } : prev
      )
    }
  }, [user])

  // ✅ Atualizar dados do perfil
  const updateProfile = useCallback(
    async (data: Partial<Database["public"]["Tables"]["profiles"]["Update"]>) => {
      if (!user) return { error: new Error("Usuário não encontrado") }

      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", user.id)

      if (error) return { error }
      await refreshProfile()
      return { success: true }
    },
    [user, refreshProfile]
  )

  // 🔐 Verifica se a sessão ainda está válida
  const checkSession = useCallback(async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    return !!session && !error
  }, [])

  // ♻️ Tenta renovar a sessão
  const refreshSession = useCallback(async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.refreshSession()

    return !!session && !error
  }, [])

  // 🔄 Carregar dados do usuário e perfil
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true)
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) throw sessionError
      if (!session) {
        setUser(null)
        return
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("user_type")
        .eq("id", session.user.id)
        .single()

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single()

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
  }, [])

  // Carregar ao montar
  useEffect(() => {
    fetchUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) fetchUser()
      else setUser(null)
    })

    return () => subscription.unsubscribe()
  }, [fetchUser])

  return {
    user,
    loading,
    error,
    updateProfile,
    refreshProfile,
    checkSession,
    refreshSession,
  }
}
