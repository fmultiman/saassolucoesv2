"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { MessageSquare, Zap } from "lucide-react"

interface PlanSolutionsListProps {
  planId: number
}

interface Solution {
  id: number
  name: string
  description: string | null
  category: string | null
  is_active: boolean
  custom_price?: number | null
  custom_limits?: Record<string, any> | null
}

export function PlanSolutionsList({ planId }: PlanSolutionsListProps) {
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/plans/${planId}/solutions`)

        if (!response.ok) {
          throw new Error(`Erro ao buscar soluções: ${response.status}`)
        }

        const data = await response.json()
        setSolutions(data)
      } catch (err) {
        console.error("Erro ao carregar soluções do plano:", err)
        setError("Não foi possível carregar as soluções deste plano")
        toast({
          title: "Erro",
          description: "Não foi possível carregar as soluções. Tente novamente mais tarde.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (planId) {
      fetchSolutions()
    }
  }, [planId, toast])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
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
        <h3 className="text-lg font-medium">Erro ao carregar soluções</h3>
        <p className="mt-2">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
          Tentar novamente
        </Button>
      </div>
    )
  }

  if (solutions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4">
          <Zap className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-medium">Nenhuma solução disponível</h3>
        <p className="mt-2 text-center text-muted-foreground max-w-md">
          Este plano não possui soluções associadas. Entre em contato com o suporte para mais informações.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {solutions.map((solution) => (
        <Card key={solution.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{solution.name}</CardTitle>
              {solution.category && <Badge variant="outline">{solution.category}</Badge>}
            </div>
            <CardDescription className="line-clamp-2">
              {solution.description || "Sem descrição disponível."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-md p-2 bg-blue-500/10 text-blue-500">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Incluído no plano</p>
                {solution.custom_price && (
                  <p className="text-xs text-muted-foreground">Preço personalizado: R$ {solution.custom_price}</p>
                )}
              </div>
            </div>
            {solution.custom_limits && (
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">Limites personalizados:</p>
                <ul className="list-disc list-inside pl-2">
                  {Object.entries(solution.custom_limits).map(([key, value]) => (
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
              <Link href={`/solucao/${solution.id}`}>Ver detalhes</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
