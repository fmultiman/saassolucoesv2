"use client"

import { useRouter } from "next/navigation"
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow"
import { useToast } from "@/hooks/use-toast"

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()

  const handleOnboardingComplete = async () => {
    try {
      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ onboarding_completed: true }),
      })

      if (!response.ok) {
        throw new Error("Nao foi possivel concluir o onboarding")
      }

      toast({
        title: "Onboarding concluido",
        description: "Sua conta foi configurada com sucesso!",
      })

      router.push("/dashboard")
    } catch (_error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao finalizar o onboarding. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return <OnboardingFlow onComplete={handleOnboardingComplete} />
}
