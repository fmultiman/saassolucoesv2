import { ArrowDown, ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface MetricaCardProps {
  metrica: {
    titulo: string
    valor: string
    icone: any
    cor: string
    tendencia: string
    positivo: boolean
  }
}

export function MetricaCard({ metrica }: MetricaCardProps) {
  const { titulo, valor, icone: Icone, cor, tendencia, positivo } = metrica

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
          {positivo ? <ArrowUp className="h-3 w-3 text-green-500" /> : <ArrowDown className="h-3 w-3 text-red-500" />}
          <span className={cn(positivo ? "text-green-500" : "text-red-500")}>{tendencia}</span>
        </CardDescription>
      </CardContent>
    </Card>
  )
}
