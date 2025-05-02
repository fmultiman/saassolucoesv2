import type React from "react"
import { viewport } from "@/lib/viewport"

export { viewport }

export const metadata = {
  title: "Email Verificado",
  description: "Seu email foi Verificado.",
}

export default function EmailVerificadoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
