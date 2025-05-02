"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { CheckCircle2, Package } from "lucide-react"

interface SolutionPlansListProps {
  solutionId: number
}

interface Plan {
  id: number
  name: string
  description: string | null
  price: number
  is_active: boolean
  custom_price?: number | null
  custom_limits?: Record<string, any> | null
}

export function SolutionPlansList({ solutionId }: SolutionPlansListProps) {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/solutions/${solutionId}/plans`)

        if (!response.ok) {
          throw new Error(`Erro ao buscar planos: ${response.status}`)
        }

        const data = await response.json()
        setPlans(data)
      } catch (err) {
        console.error("Erro ao carregar planos da solução:", err)
        setError("Não foi possível carregar os planos para esta solução")
        toast({
          title: "Erro",
          description: "Não foi possível carregar os planos. Tente novamente mais tarde.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (solutionId) {
      fetchPlans()
    }
  }, [solutionId, toast])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-md text-red-800">
        <h3 className="text-lg font-medium">Erro ao carregar planos</h3>
        <p className="mt-2">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
          Tentar novamente
        </Button>
      </div>
    )
  }

  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-medium">Nenhum plano disponível</h3>
        <p className="mt-2 text-center text-muted-foreground max-w-md">
          Esta solução não está disponível em nenhum plano. Entre em contato com o suporte para mais informações.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <Card key={plan.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              {plan.is_active ? (
                <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                  Ativo
                </Badge>
              ) : (
                <Badge variant="outline">Inativo</Badge>
              )}
            </div>
            <CardDescription className="line-clamp-2">
              {plan.description || "Sem descrição disponível."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-md p-2 bg-green-500/10 text-green-500">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Solução incluída</p>
                <p className="text-xs text-muted-foreground">Preço do plano: R$ {plan.price.toFixed(2)}/mês</p>
                {plan.custom_price && (
                  <p className="text-xs text-muted-foreground">
                    Preço personalizado: R$ {plan.custom_price.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
            {plan.custom_limits && (
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">Limites personalizados:</p>
                <ul className="list-disc list-inside pl-2">
                  {Object.entries(plan.custom_limits).map(([key, value]) => (
                    <li key={key}>
                      {key}: {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href={`/assinatura?plan=${plan.id}`}>Assinar plano</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
