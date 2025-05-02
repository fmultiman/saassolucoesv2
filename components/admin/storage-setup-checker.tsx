"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function StorageSetupChecker() {
  const [isChecking, setIsChecking] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const { toast } = useToast()

  const handleCheckStorage = async () => {
    setIsChecking(true)
    setStatus("idle")

    try {
      const response = await fetch("/api/admin/storage-setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao verificar armazenamento")
      }

      setStatus("success")
      toast({
        title: "Armazenamento verificado",
        description: "O armazenamento foi configurado com sucesso.",
      })
    } catch (error: any) {
      console.error("Erro ao verificar armazenamento:", error)
      setStatus("error")
      toast({
        variant: "destructive",
        title: "Erro ao verificar armazenamento",
        description: error.message || "Ocorreu um erro ao verificar o armazenamento.",
      })
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração de Armazenamento</CardTitle>
        <CardDescription>Verifique e configure o armazenamento para uploads de arquivos</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Esta ferramenta verifica se o bucket de armazenamento para avatares e outros conteúdos de usuário está
          configurado corretamente. Se não estiver, ele será criado automaticamente.
        </p>

        {status === "success" && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md mb-4">
            <CheckCircle className="h-5 w-5" />
            <span>Armazenamento configurado com sucesso!</span>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md mb-4">
            <AlertCircle className="h-5 w-5" />
            <span>Erro ao configurar armazenamento. Verifique os logs para mais detalhes.</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleCheckStorage} disabled={isChecking}>
          {isChecking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verificando...
            </>
          ) : (
            "Verificar Armazenamento"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
