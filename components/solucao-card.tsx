import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TruncatedDescription } from "@/components/truncated-description"
import type { LucideIcon } from "lucide-react"

interface SolucaoProps {
  id: string
  nome: string
  descricao: string
  categoria: string
  icone: LucideIcon
  cor: string
  status: string
  bloqueado: boolean
  plano?: string
}

export function SolucaoCard({ solucao }: { solucao: SolucaoProps }) {
  const { nome, descricao, icone: Icon, cor, status, bloqueado, plano } = solucao

  return (
    <Card className="h-full transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className={`rounded-md p-2 ${cor}`}>
            <Icon className="h-5 w-5" />
          </div>
          {status === "ativo" && <Badge className="bg-green-500">Ativo</Badge>}
          {status === "inativo" && <Badge variant="outline">Inativo</Badge>}
          {status === "recomendado" && <Badge className="bg-yellow-500">Recomendado</Badge>}
        </div>
        <CardTitle className="mt-4 text-xl">{nome}</CardTitle>
        <CardDescription>
          <TruncatedDescription text={descricao} maxLength={100} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        {bloqueado && (
          <div className="mt-2 flex items-center">
            <Badge variant="secondary" className="bg-gray-100">
              Disponível no plano {plano}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
