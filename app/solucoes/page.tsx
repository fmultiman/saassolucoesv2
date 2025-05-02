"use client"

import { useState } from "react"
import { SolucoesInteligentes } from "@/components/solucoes-inteligentes"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"

export default function SolucoesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${sidebarCollapsed ? "md:ml-[70px]" : "md:ml-64"}`}
      >
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <SolucoesInteligentes />
        </main>
      </div>
    </div>
  )
}
