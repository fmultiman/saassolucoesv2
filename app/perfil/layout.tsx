import type React from "react"
import { viewport } from "@/lib/viewport"

export { viewport }

export const metadata = {
  title: "Meu Perfil",
  description: "Gerencie seu perfil e informações pessoais.",
}

export default function PerfilLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
