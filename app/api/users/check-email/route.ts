import { NextResponse } from "next/server"
import { z } from "zod"
import { apiErrorResponse, logApiError } from "@/lib/errors"
import { getUserByEmail } from "@/lib/users"

const checkEmailSchema = z.object({
  email: z.string().email(),
})

export async function POST(request: Request) {
  try {
    const { email } = checkEmailSchema.parse(await request.json())
    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return NextResponse.json({ exists: true, source: "database" })
    }

    return NextResponse.json({ exists: false })
  } catch (error) {
    logApiError("api/users/check-email", error)
    return apiErrorResponse(error, "Erro ao verificar email")
  }
}
