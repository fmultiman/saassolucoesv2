// Exemplo de implementação de tratamento de erros centralizado

// Classe personalizada para erros da aplicação
export class AppError extends Error {
  public statusCode: number
  public code: string
  public context?: Record<string, any>

  constructor(message: string, statusCode = 400, code = "UNKNOWN_ERROR", context?: Record<string, any>) {
    super(message)
    this.name = "AppError"
    this.statusCode = statusCode
    this.code = code
    this.context = context
  }
}

// Erros específicos
export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 400, "VALIDATION_ERROR", context)
    this.name = "ValidationError"
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Você não tem permissão para realizar esta ação") {
    super(message, 403, "AUTHORIZATION_ERROR")
    this.name = "AuthorizationError"
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} não encontrado(a)`, 404, "NOT_FOUND_ERROR")
    this.name = "NotFoundError"
  }
}

// Função para tratar erros em APIs
export function handleApiError(error: unknown) {
  console.error("API Error:", error)

  if (error instanceof AppError) {
    return {
      error: error.message,
      code: error.code,
      status: error.statusCode,
      context: error.context,
    }
  }

  // Erros do Zod
  const maybeError = error as {
    name?: string
    code?: string
    message?: string
    format?: () => unknown
  }

  if (maybeError.name === "ZodError") {
    return {
      error: "Erro de validação",
      code: "VALIDATION_ERROR",
      status: 400,
      context: maybeError.format?.(),
    }
  }

  // Erros do Supabase
  if (maybeError.code?.startsWith?.("PGRST")) {
    return {
      error: maybeError.message || "Erro no banco de dados",
      code: maybeError.code,
      status: 500,
    }
  }

  // Erro genérico
  return {
    error: "Ocorreu um erro inesperado",
    code: "INTERNAL_ERROR",
    status: 500,
  }
}

// Função para tratar erros em componentes React
export function handleClientError(error: unknown, toast: any) {
  console.error("Client Error:", error)

  if (error instanceof AppError) {
    toast({
      title: `Erro: ${error.code}`,
      description: error.message,
      variant: "destructive",
    })
    return
  }

  // Erro genérico
  toast({
    title: "Erro",
    description: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
    variant: "destructive",
  })
}
