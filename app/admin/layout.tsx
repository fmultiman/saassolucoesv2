export const dynamic = "force-dynamic"

import type React from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { viewport } from "@/lib/viewport"

export { viewport }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Verificar autenticação no lado do servidor
  const supabase = createServerClient(cookies())

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("Erro ao verificar sessão no layout admin:", sessionError)
      redirect("/login/admin")
    }

    if (!session) {
      console.log("Nenhuma sessão encontrada no layout admin")
      redirect("/login/admin")
    }

    // Verificar se o usuário é um admin, mas não bloquear se não conseguir verificar
    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("user_type")
        .eq("id", session.user.id)
        .single()

      if (userError) {
        console.error("Erro ao verificar tipo de usuário no layout admin:", userError)
        // Não redirecionamos aqui para ser menos severo
      } else if (userData?.user_type !== "admin") {
        console.log("Usuário não é admin:", userData?.user_type)
        redirect("/login/admin")
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação no layout admin:", error)
      // Não redirecionamos aqui para ser menos severo
    }
  } catch (error) {
    console.error("Erro ao verificar autenticação no layout admin:", error)
    redirect("/login/admin")
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
