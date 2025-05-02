import type React from "react"
import { viewport } from "@/lib/viewport"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { OnboardingCheck } from "@/components/onboarding/onboarding-check"

export { viewport }

export const metadata = {
  title: "Dashboard",
  description: "Gerencie suas soluções e acompanhe seus resultados.",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <OnboardingCheck>
      <div className="flex h-screen bg-background overflow-x-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden transition-all duration-300 md:ml-64">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 overflow-x-hidden">{children}</main>
        </div>
      </div>
    </OnboardingCheck>
  )
}
