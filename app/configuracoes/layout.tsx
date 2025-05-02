import type React from "react"
import { viewport } from "@/lib/viewport"

export { viewport }

export const metadata = {
  title: "Ajuda",
  description: "Encontre respostas para suas dúvidas e aprenda a usar a plataforma.",
}

export default function ConfiguracoesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
