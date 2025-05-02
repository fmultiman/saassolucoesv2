"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error boundary caught error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
      <div className="rounded-full bg-destructive/10 p-4 mb-4">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Algo deu errado</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Ocorreu um erro ao carregar esta página. Nossa equipe foi notificada e está trabalhando para resolver o
        problema.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="default">
          Tentar novamente
        </Button>
        <Button onClick={() => (window.location.href = "/")} variant="outline">
          Voltar para a página inicial
        </Button>
      </div>
      {process.env.NODE_ENV === "development" && (
        <div className="mt-8 p-4 bg-muted rounded-md text-left overflow-auto max-w-full">
          <p className="font-mono text-sm mb-2">Detalhes do erro (apenas em desenvolvimento):</p>
          <pre className="text-xs overflow-auto">{error.message}</pre>
          {error.stack && <pre className="text-xs overflow-auto mt-2 text-muted-foreground">{error.stack}</pre>}
        </div>
      )}
    </div>
  )
}
