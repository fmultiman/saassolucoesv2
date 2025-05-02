import type React from "react"
import { viewport } from "@/lib/viewport"

export { viewport }

export const metadata = {
  title: "Minhas Soluções",
  description: "Gerencie e configure suas soluções ativas..",
}

export default function MinhasSolucoesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
