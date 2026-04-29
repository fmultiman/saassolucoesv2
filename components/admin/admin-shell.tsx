"use client"

import type React from "react"
import { useState } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen max-w-full overflow-x-hidden bg-background">
      <AdminSidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      <div
        className={`flex w-full flex-1 flex-col transition-all duration-300 ${sidebarCollapsed ? "md:pl-[70px]" : "md:pl-64"}`}
      >
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden">
          <div className="max-w-full px-4 py-4">{children}</div>
        </main>
      </div>
    </div>
  )
}
