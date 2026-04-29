export const dynamic = "force-dynamic"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import "../../globals.css"
import { viewport } from "@/lib/viewport"

export { viewport }

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Login Admin - SaaS Soluções",
  description: "Página de login para o painel administrativo da plataforma SaaS Soluções.",
}

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="min-h-screen bg-background">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}
