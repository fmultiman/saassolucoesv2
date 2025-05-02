"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Code } from "@/components/ui/code"

export function MigrationSetup() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [manualSql, setManualSql] = useState<string | null>(null)

  const setupMigrations = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    setManualSql(null)

    try {
      const response = await fetch("/api/admin/setup-migrations", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Erro desconhecido ao configurar migrações")
        if (data.manualSql) {
          setManualSql(data.manualSql)
        }
        return
      }

      setSuccess(true)
    } catch (err: any) {
      setError(`Erro ao configurar migrações: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configuração de Migrações</CardTitle>
        <CardDescription>Configure a função de migração para permitir a execução de scripts SQL</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>

            {manualSql && (
              <div className="mt-4">
                <p className="font-semibold mb-2">Execute este SQL manualmente no console SQL do Supabase:</p>
                <Code className="w-full p-4 overflow-auto max-h-60 text-xs">{manualSql}</Code>
              </div>
            )}
          </Alert>
        )}

        {success && (
          <Alert className="mb-4">
            <AlertTitle>Sucesso</AlertTitle>
            <AlertDescription>Função de migração configurada com sucesso!</AlertDescription>
          </Alert>
        )}

        <p className="text-sm text-gray-500 mb-4">
          Este processo criará a função <code>execute_sql</code> e a tabela <code>migrations</code> no seu banco de
          dados. Estas são necessárias para executar as migrações de forma segura.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={setupMigrations} disabled={isLoading}>
          {isLoading ? "Configurando..." : "Configurar Migrações"}
        </Button>
      </CardFooter>
    </Card>
  )
}
