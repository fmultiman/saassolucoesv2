"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { MarketplaceProduct } from "@/components/marketplace/marketplace-data"
import { Lock, ExternalLink, ChevronRight, Zap, Calendar, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

interface MarketplaceCardProps {
  product: MarketplaceProduct
  isPublicView?: boolean
  isLoggedIn?: boolean
}

export function MarketplaceCard({ product, isPublicView = false, isLoggedIn = false }: MarketplaceCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const isInstitutionalMode = isPublicView && !isLoggedIn

  const getIcon = () => {
    const category = product.categories[0]
    switch (category) {
      case "integration":
        return <ExternalLink className="h-5 w-5" />
      case "template":
        return <Zap className="h-5 w-5" />
      case "service":
        return <MessageSquare className="h-5 w-5" />
      case "capacity":
        return <Calendar className="h-5 w-5" />
      default:
        return <Zap className="h-5 w-5" />
    }
  }

  const getStatusColor = () => {
    switch (product.status) {
      case "included":
        return "bg-green-500/10 text-green-500 border-green-200"
      case "premium":
        return "bg-orange-500/10 text-orange-500 border-orange-200"
      case "external":
        return "bg-blue-500/10 text-blue-500 border-blue-200"
      case "coming-soon":
        return "bg-purple-500/10 text-purple-500 border-purple-200"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-200"
    }
  }

  const getStatusText = () => {
    if (isInstitutionalMode && product.requiresLogin) {
      return "Complemento interno"
    }

    switch (product.status) {
      case "included":
        return "Incluído no seu plano"
      case "premium":
        return "Premium"
      case "external":
        return "Serviço externo"
      case "coming-soon":
        return "Em breve"
      default:
        return "Disponível"
    }
  }

  const getCategoryBadge = () => {
    const category = product.categories[0]
    switch (category) {
      case "integration":
        return <Badge variant="outline">Integração</Badge>
      case "template":
        return <Badge variant="outline">Template</Badge>
      case "service":
        return <Badge variant="outline">Serviço</Badge>
      case "capacity":
        return <Badge variant="outline">Capacidade</Badge>
      case "premium":
        return <Badge variant="outline">Premium</Badge>
      default:
        return <Badge variant="outline">Solução</Badge>
    }
  }

  const renderActionButton = () => {
    if (isInstitutionalMode) {
      if (product.requiresLogin) {
        return (
          <Button variant="outline" className="w-full" asChild>
            <Link href="/login">Acesse a plataforma</Link>
          </Button>
        )
      }

      if (product.status === "external") {
        return <Button className="w-full">Solicitar proposta</Button>
      }

      return (
        <Button variant="outline" className="w-full">
          Ver mais
        </Button>
      )
    }

    switch (product.status) {
      case "included":
        return <Button className="w-full">Ativar</Button>
      case "premium":
        return <Button className="w-full">Upgrade de plano</Button>
      case "external":
        return (
          <Button variant="outline" className="w-full">
            Solicitar
          </Button>
        )
      case "coming-soon":
        return (
          <Button variant="outline" className="w-full" disabled>
            Em breve
          </Button>
        )
      default:
        return (
          <Button variant="outline" className="w-full">
            Ver mais
          </Button>
        )
    }
  }

  return (
    <Card
      className={cn("flex h-full flex-col overflow-hidden transition-all duration-300", isHovered && "scale-[1.02] shadow-md")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "rounded-md p-2",
              product.categories[0] === "integration"
                ? "bg-blue-500/10 text-blue-500"
                : product.categories[0] === "template"
                  ? "bg-green-500/10 text-green-500"
                  : product.categories[0] === "service"
                    ? "bg-orange-500/10 text-orange-500"
                    : product.categories[0] === "capacity"
                      ? "bg-purple-500/10 text-purple-500"
                      : "bg-primary/10 text-primary",
            )}
          >
            {getIcon()}
          </div>
          <Badge variant="outline" className={getStatusColor()}>
            {getStatusText()}
          </Badge>
        </div>
        <CardTitle className="mt-2 text-lg">{product.name}</CardTitle>
        <div className="mt-1 flex items-center gap-2">
          {getCategoryBadge()}
          {isInstitutionalMode && product.requiresLogin && (
            <Badge variant="outline" className="border-gray-200 bg-gray-500/10 text-gray-500">
              <Lock className="mr-1 h-3 w-3" />
              Exige login
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="min-h-[2.5rem] line-clamp-2">{product.description}</CardDescription>
        {isInstitutionalMode && product.requiresLogin && (
          <p className="mt-2 text-xs italic text-muted-foreground">
            Essa solução é um complemento para usuários da plataforma. Faça login para ativar ou saber mais.
          </p>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex w-full gap-2">
          {renderActionButton()}
          <Button variant="ghost" size="icon" title="Ver mais">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
