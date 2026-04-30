export const dynamic = "force-dynamic"

import type React from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { getCurrentUser } from "@/lib/auth/getCurrentUser"
import { viewport } from "@/lib/viewport"
import { redirect } from "next/navigation"

export { viewport }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/login/admin")
  }

  if (currentUser.profile.user_type !== "admin") {
    redirect("/dashboard")
  }

  return <AdminShell>{children}</AdminShell>
}
