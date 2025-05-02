"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export function StorageInitializer() {
  const [initialized, setInitialized] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const initStorage = async () => {
      try {
        const response = await fetch("/api/storage/init", { method: "POST" })
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Erro ao inicializar storage")
        }

        setInitialized(true)
        console.log("Storage inicializado com sucesso:", data)
      } catch (error: any) {
        console.error("Erro ao inicializar storage:", error)
        toast({
          variant: "destructive",
          title: "Erro ao inicializar storage",
          description:
            "Houve um problema ao configurar o armazenamento. Algumas funcionalidades podem não funcionar corretamente.",
        })
      }
    }

    initStorage()
  }, [toast])

  return null // Este componente não renderiza nada visualmente
}
