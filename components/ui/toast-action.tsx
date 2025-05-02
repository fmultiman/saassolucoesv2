"use client"

import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface ToastActionProps extends ButtonProps {
  action: () => Promise<void>
  successMessage: string
  errorMessage?: string
  loadingText?: string
  onSuccess?: () => void
}

export function ToastAction({
  action,
  successMessage,
  errorMessage = "Ocorreu um erro. Tente novamente.",
  loadingText = "Processando...",
  onSuccess,
  children,
  ...props
}: ToastActionProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = async () => {
    setIsLoading(true)
    try {
      await action()
      toast({
        title: "Sucesso",
        description: successMessage,
        variant: "default",
      })
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Erro na ação:", error)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleAction} disabled={isLoading} {...props}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  )
}
