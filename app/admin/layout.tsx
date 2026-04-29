export const dynamic = "force-dynamic"

import type React from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminShell } from "@/components/admin/admin-shell"
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

  return <AdminShell>{children}</AdminShell>
}
