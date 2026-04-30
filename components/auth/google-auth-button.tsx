"use client"

import { Loader2 } from "lucide-react"
import { startGoogleOAuth } from "@/lib/auth/browser-auth"
import { Button } from "@/components/ui/button"

type GoogleAuthButtonProps = {
  disabled?: boolean
}

export function GoogleAuthButton({ disabled }: GoogleAuthButtonProps) {
  const handleGoogleAuth = async () => {
    const { error } = await startGoogleOAuth()
    if (error) {
      throw error
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      disabled={disabled}
      onClick={() => {
        void handleGoogleAuth()
      }}
    >
      {disabled ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Continuar com Google
    </Button>
  )
}
