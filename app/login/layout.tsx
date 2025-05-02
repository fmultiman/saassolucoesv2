import type React from "react"
import { viewport } from "@/lib/viewport"

export { viewport }

export const metadata = {
  title: "Login",
  description: "Faça login para acessar sua conta.",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
