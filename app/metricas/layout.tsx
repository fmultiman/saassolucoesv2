import type React from "react"
import { viewport } from "@/lib/viewport"

export { viewport }

export const metadata = {
  title: "Desempenho e Métricas",
  description: "Acompanhe o desempenho das suas soluções inteligentes.",
}

export default function MetricasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
