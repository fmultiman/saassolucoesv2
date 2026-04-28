export const dynamic = "force-dynamic"

import type React from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { viewport } from "@/lib/viewport"

export { viewport }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen max-w-full bg-background overflow-x-hidden">
      <AdminSidebar />
      <div className="flex flex-col flex-1 w-full md:pl-64">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden w-full">
          <div className="px-4 py-4 max-w-full">{children}</div>
        </main>
      </div>
    </div>
  )
}
