import type React from "react"
import { viewport } from "@/lib/viewport"

export { viewport }

export const metadata = {
  title: "Soluções Inteligentes",
  description: "Explore nossas soluções inteligentes.",
}

export default function SolucoesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
