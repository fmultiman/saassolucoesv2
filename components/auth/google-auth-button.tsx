"use client"

import { Loader2 } from "lucide-react"
import { startGoogleOAuth } from "@/lib/auth/browser-auth"
import { Button } from "@/components/ui/button"

type GoogleAuthButtonProps = {
  disabled?: boolean
}

function GoogleLogo() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path
        d="M21.805 10.023H12v4.182h5.615c-.242 1.35-1.624 3.96-5.615 3.96-3.378 0-6.13-2.798-6.13-6.25s2.752-6.25 6.13-6.25c1.925 0 3.214.822 3.955 1.529l2.692-2.601C16.932 2.998 14.708 2 12 2 6.478 2 2 6.477 2 12s4.478 10 10 10c5.773 0 9.6-4.057 9.6-9.773 0-.656-.071-1.156-.157-1.604Z"
        fill="#4285F4"
      />
      <path
        d="M3.153 7.346 6.59 9.865C7.52 7.56 9.57 5.935 12 5.935c1.925 0 3.214.822 3.955 1.529l2.692-2.601C16.932 2.998 14.708 2 12 2 8.159 2 4.826 4.168 3.153 7.346Z"
        fill="#EA4335"
      />
      <path
        d="M12 22c2.637 0 4.85-.87 6.467-2.352l-2.99-2.446c-.8.558-1.87.948-3.477.948-3.975 0-5.35-2.68-5.607-3.997l-3.41 2.628C4.639 19.903 8.038 22 12 22Z"
        fill="#34A853"
      />
      <path
        d="M3.153 7.346A9.96 9.96 0 0 0 2 12c0 1.61.385 3.13 1.068 4.48l3.41-2.628A6.3 6.3 0 0 1 5.87 12c0-.642.108-1.263.306-1.835l-3.023-2.82Z"
        fill="#FBBC05"
      />
    </svg>
  )
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
      className="h-11 w-full justify-center gap-3 border-border/80 bg-white font-medium text-slate-900 shadow-sm hover:bg-slate-50 hover:text-slate-900 dark:border-white/15 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
      disabled={disabled}
      onClick={() => {
        void handleGoogleAuth()
      }}
    >
      {disabled ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleLogo />}
      <span>Continuar com Google</span>
    </Button>
  )
}
