import { NextResponse } from "next/server"
import { ZodError } from "zod"

export class ApiError extends Error {
  status: number
  details?: unknown

  constructor(status: number, message: string, details?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.details = details
  }
}

export function badRequestError(message: string, details?: unknown) {
  return new ApiError(400, message, details)
}

export function unauthorizedError(message = "Nao autorizado") {
  return new ApiError(401, message)
}

export function forbiddenError(message = "Acesso negado") {
  return new ApiError(403, message)
}

export function notFoundError(message = "Recurso nao encontrado") {
  return new ApiError(404, message)
}

export function logApiError(scope: string, error: unknown) {
  console.error(`[${scope}]`, error)
}

export function apiErrorResponse(error: unknown, fallbackMessage = "Erro interno do servidor") {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message, details: error.details }, { status: error.status })
  }

  if (error instanceof ZodError) {
    return NextResponse.json({ error: "Dados invalidos", details: error.flatten() }, { status: 400 })
  }

  logApiError("api", error)
  return NextResponse.json({ error: fallbackMessage }, { status: 500 })
}
