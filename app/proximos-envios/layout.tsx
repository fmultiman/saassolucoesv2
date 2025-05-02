import type React from "react"
import { viewport } from "@/lib/viewport"

export { viewport }

export const metadata = {
  title: "Próximos Envios",
  description: "Gerencie os envios programados das suas soluções.",
}

export default function ProximosEnviosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
