import type React from "react"
import { viewport } from "@/lib/viewport"

export { viewport }

export const metadata = {
  title: "Minha Conta",
  description: "Gerencie suas informações pessoais e preferências.",
}

export default function ContaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
