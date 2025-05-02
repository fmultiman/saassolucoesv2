"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { isFeatureEnabled } from "@/lib/simple-feature-flags"

// Este componente verifica se o usuário precisa passar pelo onboarding
export function OnboardingCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se o onboarding está habilitado
    const onboardingEnabled = isFeatureEnabled("onboarding")
    if (!onboardingEnabled) {
      setLoading(false)
      return
    }

    // Verificar se o usuário já completou o onboarding
    // Em um cenário real, isso viria do banco de dados
    const checkOnboardingStatus = async () => {
      try {
        // Simulação: verificar se o usuário já completou o onboarding
        const hasCompletedOnboarding = localStorage.getItem("onboarding_completed") === "true"

        if (!hasCompletedOnboarding) {
          // Redirecionar para o onboarding
          router.push("/onboarding")
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error("Erro ao verificar status de onboarding:", error)
        setLoading(false)
      }
    }

    checkOnboardingStatus()
  }, [router])

  if (loading) {
    // Você pode mostrar um loader aqui
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  return <>{children}</>
}
