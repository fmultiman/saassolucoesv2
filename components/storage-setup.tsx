"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function StorageSetup() {
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [status, setStatus] = useState<"unchecked" | "configured" | "not_configured">("unchecked")
  const { toast } = useToast()

  // Verificar status atual do armazenamento
  const checkStorageStatus = async () => {
    try {
      const response = await fetch("/api/storage/status", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Adicionar cache: 'no-store' para evitar cache da requisição
        cache: "no-store",
      })

      const data = await response.json()

      if (response.ok && data.configured) {
        setStatus("configured")
      } else {
        setStatus("not_configured")
      }
    } catch (error) {
      console.error("Erro ao verificar status do armazenamento:", error)
      setStatus("not_configured")
    } finally {
      setIsInitialLoading(false)
    }
  }

  // Configurar armazenamento
  const setupStorage = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/storage/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Armazenamento configurado",
          description: "O armazenamento foi configurado com sucesso.",
        })
        setStatus("configured")
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao configurar armazenamento",
          description: data.error || "Ocorreu um erro ao configurar o armazenamento.",
        })
      }
    } catch (error: any) {
      console.error("Erro ao configurar armazenamento:", error)
      toast({
        variant: "destructive",
        title: "Erro ao configurar armazenamento",
        description: error.message || "Ocorreu um erro ao configurar o armazenamento.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Verificar status ao carregar o componente
  useEffect(() => {
    checkStorageStatus()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração de Armazenamento</CardTitle>
        <CardDescription>Configure o armazenamento para permitir upload de arquivos e imagens.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          {isInitialLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : status === "configured" ? (
            <CheckCircle className="h-8 w-8 text-green-500" />
          ) : (
            <AlertCircle className="h-8 w-8 text-amber-500" />
          )}
          <div>
            <h3 className="font-medium">
              {isInitialLoading
                ? "Verificando configuração..."
                : status === "configured"
                  ? "Armazenamento configurado"
                  : "Armazenamento não configurado"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isInitialLoading
                ? "Verificando status do armazenamento..."
                : status === "configured"
                  ? "O bucket user-content está configurado e pronto para uso."
                  : "É necessário configurar o armazenamento para permitir upload de arquivos."}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={setupStorage}
          disabled={isLoading || isInitialLoading || status === "configured"}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Configurando...
            </>
          ) : status === "configured" ? (
            "Já configurado"
          ) : (
            "Configurar armazenamento"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
