"use client"

import { useRouter } from "next/navigation"
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow"
import { useToast } from "@/hooks/use-toast"

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()

  const handleOnboardingComplete = async () => {
    try {
      // Aqui você pode salvar os dados do onboarding no banco de dados
      // Por exemplo, usando uma chamada de API

      // Exemplo simples:
      // await fetch('/api/user/onboarding', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ completed: true })
      // })

      toast({
        title: "Onboarding concluído",
        description: "Sua conta foi configurada com sucesso!",
      })

      // Redirecionar para o dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Erro ao salvar dados de onboarding:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao finalizar o onboarding. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return <OnboardingFlow onComplete={handleOnboardingComplete} />
}
