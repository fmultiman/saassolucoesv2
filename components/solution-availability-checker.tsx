"use client"

import { useEffect, useState } from "react"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Lock } from "lucide-react"
import Link from "next/link"

interface SolutionAvailabilityCheckerProps {
  solutionId: number
  onAvailabilityChange?: (isAvailable: boolean) => void
}

export function SolutionAvailabilityChecker({ solutionId, onAvailabilityChange }: SolutionAvailabilityCheckerProps) {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reason, setReason] = useState<string | null>(null)
  const [planId, setPlanId] = useState<number | null>(null)
  const user = useCurrentUser()

  useEffect(() => {
    const checkAvailability = async () => {
      if (!user?.id) {
        setIsAvailable(false)
        setReason("Você precisa estar logado para acessar esta solução")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const response = await fetch(`/api/solutions/${solutionId}/availability`)

        if (!response.ok) {
          throw new Error(`Erro ao verificar disponibilidade: ${response.status}`)
        }

        const data = await response.json()
        setIsAvailable(data.available)
        setReason(data.reason || null)
        setPlanId(data.plan_id || null)

        if (onAvailabilityChange) {
          onAvailabilityChange(data.available)
        }
      } catch (err) {
        console.error("Erro ao verificar disponibilidade:", err)
        setError("Não foi possível verificar a disponibilidade desta solução")
        setIsAvailable(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAvailability()
  }, [solutionId, user, onAvailabilityChange])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-pulse h-6 w-32 bg-muted rounded"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (isAvailable) {
    return (
      <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle>Solução disponível</AlertTitle>
        <AlertDescription>Esta solução está disponível no seu plano atual.</AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert variant="default" className="bg-amber-50 border-amber-200 text-amber-800">
      <Lock className="h-4 w-4 text-amber-600" />
      <AlertTitle>Solução não disponível</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>{reason || "Esta solução não está disponível no seu plano atual."}</p>
        {planId && (
          <div className="flex flex-wrap gap-2 mt-2">
            <Button asChild size="sm" variant="outline" className="border-amber-300 hover:bg-amber-100">
              <Link href="/assinatura">Ver planos disponíveis</Link>
            </Button>
            <Button asChild size="sm" className="bg-amber-600 hover:bg-amber-700">
              <Link href={`/solucao/${solutionId}/upgrade`}>Fazer upgrade</Link>
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  )
}
