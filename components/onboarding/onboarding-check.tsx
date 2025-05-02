"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { OnboardingModal } from "./onboarding-modal"

export function OnboardingCheck({ children }: { children: React.ReactNode }) {
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    // Verificar se é o primeiro acesso do usuário
    const hasCompletedOnboarding = localStorage.getItem("onboarding_completed")
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true)
    }
  }, [])

  const handleCompleteOnboarding = () => {
    localStorage.setItem("onboarding_completed", "true")
    setShowOnboarding(false)
  }

  return (
    <>
      {children}
      {showOnboarding && <OnboardingModal onComplete={handleCompleteOnboarding} />}
    </>
  )
}
