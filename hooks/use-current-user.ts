"use client"

import { useCallback, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/types"
import { supabase } from "@/lib/supabase/client"

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"]
type PublicUserRow = Database["public"]["Tables"]["users"]["Row"]

type UserWithProfile = User & {
  user_type?: string
  profile?: ProfileRow | null
  account?: PublicUserRow | null
}

type CurrentProfileResponse = {
  user: PublicUserRow
  profile: ProfileRow | null
}

export function useCurrentUser() {
  const [user, setUser] = useState<UserWithProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadCurrentUserFromApi = useCallback(async (authUser: User) => {
    const response = await fetch("/api/user/profile", {
      method: "GET",
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Erro ao carregar perfil: ${response.status}`)
    }

    const payload = (await response.json()) as CurrentProfileResponse

    setUser({
      ...authUser,
      user_type: payload.user.user_type || undefined,
      profile: payload.profile || null,
      account: payload.user,
    })
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!user) return
    await loadCurrentUserFromApi(user)
  }, [loadCurrentUserFromApi, user])

  const updateProfile = useCallback(
    async (data: Partial<Database["public"]["Tables"]["profiles"]["Update"]>) => {
      if (!user) return { error: new Error("Usuario nao encontrado") }

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        return { error: new Error(payload?.error || "Erro ao atualizar perfil") }
      }

      await refreshProfile()
      return { success: true }
    },
    [refreshProfile, user],
  )

  const checkSession = useCallback(async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    return !!session && !error
  }, [])

  const refreshSession = useCallback(async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.refreshSession()

    return !!session && !error
  }, [])

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) throw sessionError
      if (!session) {
        setUser(null)
        return
      }

      await loadCurrentUserFromApi(session.user)
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError : new Error(String(fetchError)))
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [loadCurrentUserFromApi])

  useEffect(() => {
    void fetchUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        void fetchUser()
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchUser])

  return {
    user,
    id: user?.id,
    roles: user?.user_type ? [user.user_type] : [],
    profile: user?.profile || null,
    account: user?.account || null,
    loading,
    error,
    updateProfile,
    refreshProfile,
    checkSession,
    refreshSession,
  }
}
