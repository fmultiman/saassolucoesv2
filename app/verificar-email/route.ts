import { NextResponse } from "next/server"
import { verifyEmailToken } from "@/lib/services/email-verification-service"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const token = url.searchParams.get("token")

  if (!token) {
    console.warn("[email-change] missing token in /verificar-email")
    return NextResponse.redirect(new URL("/erro?type=invalid_token", url.origin))
  }

  try {
    await verifyEmailToken(token)
    return NextResponse.redirect(new URL("/dashboard?emailUpdated=true", url.origin))
  } catch (error) {
    if (error instanceof Error && error.message === "invalid_token") {
      console.warn("[email-change] invalid token redirect", { token })
      return NextResponse.redirect(new URL("/erro?type=invalid_token", url.origin))
    }

    console.error("[email-change] unexpected verification error", { token, error })
    return NextResponse.redirect(new URL("/erro?type=invalid_token", url.origin))
  }
}
