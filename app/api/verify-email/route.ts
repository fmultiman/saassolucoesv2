import { NextResponse } from "next/server"
import { verifyEmailToken } from "@/lib/services/email-verification-service"

export async function GET(request: Request) {
  try {
    // Extrair token da URL
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 400 })
    }

    // Verificar token
    const result = await verifyEmailToken(token)

    // Redirecionar para página de sucesso
    return NextResponse.redirect(new URL("/email-verificado", request.url))
  } catch (error: any) {
    console.error("Erro ao verificar email:", error)

    // Redirecionar para página de erro
    return NextResponse.redirect(
      new URL(`/email-verificado?error=${encodeURIComponent(error.message || "Erro ao verificar email")}`, request.url),
    )
  }
}
