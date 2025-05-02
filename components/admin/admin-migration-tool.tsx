"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

export function AdminMigrationTool() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    message?: string
    errors?: string[]
  } | null>(null)

  const handleMigrateSolutions = async () => {
    try {
      setIsLoading(true)
      setResult(null)

      const response = await fetch("/api/admin/migrate-solutions")
      const data = await response.json()

      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        message: "Erro ao executar a migração: " + (error instanceof Error ? error.message : String(error)),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ferramenta de Migração</CardTitle>
        <CardDescription>Migre as soluções do catálogo antigo para o banco de dados.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium">Migração de Soluções</h3>
            <p className="text-sm text-muted-foreground">
              Esta ferramenta irá migrar as 47 soluções do catálogo antigo para o banco de dados Supabase. As soluções
              existentes serão atualizadas e novas soluções serão criadas.
            </p>
          </div>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              <div className="flex items-center gap-2">
                {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{result.success ? "Sucesso" : "Erro"}</AlertTitle>
              </div>
              <AlertDescription className="mt-2">
                {result.message}

                {result.errors && result.errors.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 text-sm">
                    {result.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleMigrateSolutions} disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Migrando...
            </>
          ) : (
            "Migrar Soluções"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
