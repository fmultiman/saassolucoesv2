import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function VerifyLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Verificação de Conta</CardTitle>
          <CardDescription>Verificando sua identidade...</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
          <Loader2 className="h-16 w-16 text-primary animate-spin" />
          <p className="text-center text-muted-foreground">
            Estamos processando sua solicitação. Por favor, aguarde...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
