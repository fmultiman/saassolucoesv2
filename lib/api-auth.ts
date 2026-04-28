import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export async function getCurrentApiUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return { user: null, userType: null }
  }

  const supabaseAdmin = createServiceRoleClient()
  const { data: userData } = await supabaseAdmin.from("users").select("user_type").eq("id", user.id).maybeSingle()
  const userType = userData?.user_type || user.user_metadata?.user_type || user.user_metadata?.tipo || "client"

  return { user, userType }
}

export async function requireAdminApiUser() {
  const { user, userType } = await getCurrentApiUser()

  if (!user) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
  }

  if (userType !== "admin") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
  }

  return null
}

export async function requireSelfOrAdminApiUser(userId: string) {
  const { user, userType } = await getCurrentApiUser()

  if (!user) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
  }

  if (user.id !== userId && userType !== "admin") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
  }

  return null
}
