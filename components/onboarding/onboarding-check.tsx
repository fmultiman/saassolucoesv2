"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { OnboardingModal } from "./onboarding-modal"

type CurrentProfileResponse = {
  user?: {
    onboarding_completed?: boolean | null
  }
}

export function OnboardingCheck({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadOnboardingState = async () => {
      try {
        const response = await fetch("/api/user/profile", {
          method: "GET",
          cache: "no-store",
        })

        const payload = (await response.json().catch(() => null)) as CurrentProfileResponse | null

        if (!isMounted) return

        if (!response.ok) {
          setShowOnboarding(false)
          return
        }

        setShowOnboarding(!payload?.user?.onboarding_completed)
      } finally {
        if (isMounted) {
          setChecking(false)
        }
      }
    }

    void loadOnboardingState()

    return () => {
      isMounted = false
    }
  }, [])

  const handleCompleteOnboarding = async () => {
    const response = await fetch("/api/users", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ onboarding_completed: true }),
    })

    if (response.ok) {
      setShowOnboarding(false)
    }
  }

  if (checking) {
    return <>{children}</>
  }

  return (
    <>
      {children}
      {showOnboarding && <OnboardingModal onComplete={handleCompleteOnboarding} />}
    </>
  )
}
