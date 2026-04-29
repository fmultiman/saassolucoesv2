"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isFeatureEnabled } from "@/lib/simple-feature-flags"

type CurrentProfileResponse = {
  user?: {
    onboarding_completed?: boolean | null
  }
}

export function OnboardingCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const onboardingEnabled = isFeatureEnabled("onboarding")
    if (!onboardingEnabled) {
      setLoading(false)
      return
    }

    const checkOnboardingStatus = async () => {
      try {
        const response = await fetch("/api/user/profile", {
          method: "GET",
          cache: "no-store",
        })

        const payload = (await response.json().catch(() => null)) as CurrentProfileResponse | null

        if (response.ok && payload?.user && !payload.user.onboarding_completed) {
          router.push("/onboarding")
          return
        }
      } finally {
        setLoading(false)
      }
    }

    void checkOnboardingStatus()
  }, [router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  return <>{children}</>
}
