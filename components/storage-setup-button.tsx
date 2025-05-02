"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function StorageSetupButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const setupStorage = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/storage/setup", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao configurar armazenamento")
      }

      toast({
        title: "Armazenamento configurado",
        description: "O armazenamento foi configurado com sucesso.",
      })

      return data
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

  return (
    <Button onClick={setupStorage} disabled={isLoading} variant="outline" size="sm">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Configurando...
        </>
      ) : (
        "Configurar Armazenamento"
      )}
    </Button>
  )
}
