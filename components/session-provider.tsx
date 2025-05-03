"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { supabase } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

type SessionContextType = {
  user: User | null
  isLoading: boolean
}

const SessionContext = createContext<SessionContextType>({
  user: null,
  isLoading: true,
})

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar sessão atual
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user || null)
      } catch (error) {
        console.error("Erro ao verificar sessão:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

    // Configurar listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return <SessionContext.Provider value={{ user, isLoading }}>{children}</SessionContext.Provider>
}

export const useSession = () => useContext(SessionContext)
