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
  isPublic?: boolean
}

export function MarketplaceCard({ product, isPublic = false }: MarketplaceCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Determina o ícone com base na categoria principal do produto
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

  // Determina a cor da tag de status
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

  // Determina o texto do status
  const getStatusText = () => {
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

  // Determina o botão de ação com base no status e se é público ou não
  const renderActionButton = () => {
    if (isPublic && product.requiresLogin) {
      return (
        <Button variant="outline" className="w-full" asChild>
          <Link href="/dashboard">Acesse a plataforma</Link>
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

  // Determina a tag de categoria
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

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 flex flex-col h-full",
        isHovered && "shadow-md scale-[1.02]",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
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
        <div className="flex items-center gap-2 mt-1">
          {getCategoryBadge()}
          {isPublic && product.requiresLogin && (
            <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-200">
              <Lock className="h-3 w-3 mr-1" />
              Exige login
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="line-clamp-2 min-h-[2.5rem]">{product.description}</CardDescription>
        {isPublic && product.requiresLogin && (
          <p className="text-xs text-muted-foreground mt-2 italic">
            Essa solução é um complemento para usuários da plataforma. Faça login para ativar ou saber mais.
          </p>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <div className="w-full flex gap-2">
          {renderActionButton()}
          <Button variant="ghost" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
