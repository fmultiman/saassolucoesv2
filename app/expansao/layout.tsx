import type React from "react"
import { viewport } from "@/lib/viewport"

export { viewport }

export const metadata = {
  title: "Expansão",
  description: "Expanda suas soluções e recursos.",
}

export default function ExpansaoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
