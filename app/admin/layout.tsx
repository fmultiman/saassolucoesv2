export const dynamic = "force-dynamic"

import type React from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { createServerClient } from "@/lib/supabase/server"
import { viewport } from "@/lib/viewport"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export { viewport }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient(await cookies())
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login/admin")
  }

  const { data: userData } = await supabase.from("users").select("user_type").eq("id", user.id).maybeSingle()
  const userType = userData?.user_type || user.user_metadata?.user_type || user.user_metadata?.tipo

  if (userType !== "admin") {
    redirect("/dashboard")
  }

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
