import type React from "react"
import { viewport } from "@/lib/viewport"

export { viewport }

export const metadata = {
  title: "Minha Assinatura",
  description: "Gerencie seu plano e veja seu histórico de pagamentos.",
}

export default function AssinaturaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
