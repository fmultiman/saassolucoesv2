import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { logError } from "@/lib/logger"

export class ApiError extends Error {
  status: number
  code: string
  details?: unknown

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.code = code
    this.details = details
  }
}

export function badRequestError(message: string, details?: unknown, code = "BAD_REQUEST") {
  return new ApiError(400, code, message, details)
}

export function unauthorizedError(message = "Nao autorizado", code = "UNAUTHORIZED") {
  return new ApiError(401, code, message)
}

export function forbiddenError(message = "Acesso negado", code = "FORBIDDEN") {
  return new ApiError(403, code, message)
}

export function notFoundError(message = "Recurso nao encontrado", code = "NOT_FOUND") {
  return new ApiError(404, code, message)
}

export function logApiError(scope: string, error: unknown) {
  logError(scope, error)
}

export function apiErrorResponse(error: unknown, fallbackMessage = "Erro interno do servidor") {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message, code: error.code, details: error.details }, { status: error.status })
  }

  if (error instanceof ZodError) {
    return NextResponse.json({ error: "Dados invalidos", code: "VALIDATION_ERROR", details: error.flatten() }, { status: 400 })
  }

  logApiError("api", error)
  return NextResponse.json({ error: fallbackMessage, code: "INTERNAL_SERVER_ERROR" }, { status: 500 })
}
