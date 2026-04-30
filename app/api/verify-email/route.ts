import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const token = url.searchParams.get("token")
  const redirectUrl = new URL(token ? `/verificar-email?token=${encodeURIComponent(token)}` : "/erro?type=invalid_token", url.origin)

  return NextResponse.redirect(redirectUrl)
}
