import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface MetricaCardProps {
  metrica: {
    titulo: string
    valor: string
    icone: any
    cor: string
    tendencia: string
    direcao?: "up" | "down" | "neutral"
  }
}

export function MetricaCard({ metrica }: MetricaCardProps) {
  const { titulo, valor, icone: Icone, cor, tendencia, direcao = "neutral" } = metrica

  const trendStyles =
    direcao === "up"
      ? "text-green-500"
      : direcao === "down"
        ? "text-red-500"
        : "text-muted-foreground"

  const TrendIcon = direcao === "up" ? ArrowUp : direcao === "down" ? ArrowDown : ArrowRight

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{titulo}</CardTitle>
        <div className={cn("rounded-md p-2", cor)}>
          <Icone className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{valor}</div>
        <CardDescription className="flex items-center gap-1 pt-1">
          <TrendIcon className={cn("h-3 w-3", trendStyles)} />
          <span className={cn(trendStyles)}>{tendencia}</span>
        </CardDescription>
      </CardContent>
    </Card>
  )
}
