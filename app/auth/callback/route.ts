import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`)
  }

  const supabase = createServerClient(await cookies())
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error("Erro ao trocar codigo:", error)
    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}
