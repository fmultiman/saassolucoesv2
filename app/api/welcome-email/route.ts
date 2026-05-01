import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { apiErrorResponse, logApiError } from "@/lib/errors"
import { logError, logInfo } from "@/lib/logger"
import { sendWelcomeEmail } from "@/lib/services/email-service"

const welcomeEmailSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(120).optional(),
})

export async function POST(request: NextRequest, _context: { params: Promise<Record<string, never>> }) {
  try {
    const payload = welcomeEmailSchema.parse(await request.json())

    try {
      await sendWelcomeEmail(payload.email, payload.name)
      logInfo("WELCOME_EMAIL_REQUEST_SUCCEEDED", {
        email: payload.email,
      })
    } catch (error) {
      logError("WELCOME_EMAIL_REQUEST_FAILED", {
        email: payload.email,
        error,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logApiError("api/welcome-email POST", error)
    return apiErrorResponse(error)
  }
}
