import type React from "react"
import { viewport } from "@/lib/viewport"

export { viewport }

export const metadata = {
  title: "Interações",
  description: "Acompanhe todas as interações com seus clientes.",
}

export default function InteracoesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
