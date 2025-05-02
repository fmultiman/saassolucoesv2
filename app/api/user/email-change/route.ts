import { NextResponse } from "next/server"
import { z } from "zod"
import { requestEmailChange } from "@/lib/services/email-verification-service"
import { getCurrentUser } from "@/lib/session"
import { rateLimit } from "@/lib/rate-limit"

// Schema de validação
const emailChangeSchema = z.object({
  email: z.string().email("Email inválido"),
})

export async function POST(request: Request) {
  try {
    // Verificar usuário atual
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Rate limiting - 3 solicitações por hora
    const identifier = `email-change-${user.id}`
    const { success, limit, remaining } = await rateLimit(identifier, 3, 3600)

    if (!success) {
      return NextResponse.json(
        {
          error: "Muitas solicitações. Tente novamente mais tarde.",
          limit,
          remaining: 0,
          reset: Date.now() + 3600 * 1000,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": (Date.now() + 3600 * 1000).toString(),
          },
        },
      )
    }

    // Validar dados
    const body = await request.json()
    const validationResult = emailChangeSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors[0].message }, { status: 400 })
    }

    const { email } = validationResult.data

    // Verificar se o email é diferente do atual
    if (user.email === email) {
      return NextResponse.json({ error: "O novo email deve ser diferente do atual" }, { status: 400 })
    }

    // Solicitar mudança de email
    await requestEmailChange(user.id, email)

    return NextResponse.json({
      success: true,
      message: "Email de verificação enviado. Verifique sua caixa de entrada.",
    })
  } catch (error: any) {
    console.error("Erro ao solicitar mudança de email:", error)
    return NextResponse.json({ error: error.message || "Erro ao processar solicitação" }, { status: 500 })
  }
}
