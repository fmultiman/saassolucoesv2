const PRODUCTION_SITE_URL = "https://saas.multihuman.com.br"

function isLocalOrigin(origin: string) {
  return origin.includes("localhost") || origin.includes("127.0.0.1")
}

function resolveBaseUrl() {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()

  if (configuredSiteUrl) {
    return configuredSiteUrl
  }

  if (typeof window !== "undefined") {
    const currentOrigin = window.location.origin
    if (isLocalOrigin(currentOrigin)) {
      return currentOrigin
    }
  }

  return PRODUCTION_SITE_URL
}

export function getAuthRedirectUrls() {
  const baseUrl = resolveBaseUrl()
  const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl

  if (process.env.NODE_ENV === "development") {
    console.log("Base URL para redirecionamento:", normalizedBaseUrl)
  }

  return {
    emailRedirectTo: `${normalizedBaseUrl}/auth/callback`,
    resetPasswordRedirectTo: `${normalizedBaseUrl}/auth/reset-password`,
  }
}

export function logAuthRedirectUrls() {
  const urls = getAuthRedirectUrls()
  console.log("=== URLs de Redirecionamento de Autenticacao ===")
  console.log("Email Redirect:", urls.emailRedirectTo)
  console.log("Reset Password Redirect:", urls.resetPasswordRedirectTo)
  console.log("NEXT_PUBLIC_SITE_URL:", process.env.NEXT_PUBLIC_SITE_URL)
  console.log("window.location.origin:", typeof window !== "undefined" ? window.location.origin : "N/A (server)")
  console.log("================================================")
  return urls
}

export function formatAuthError(error: unknown): string {
  if (!error) return "Ocorreu um erro desconhecido"

  const errorMessage = error instanceof Error ? error.message : String(error)

  if (errorMessage.includes("Invalid login credentials")) {
    return "Email ou senha incorretos"
  }

  if (errorMessage.includes("Email not confirmed")) {
    return "Email nao confirmado. Por favor, verifique sua caixa de entrada"
  }

  if (errorMessage.includes("already registered")) {
    return "Este email ja esta registrado"
  }

  if (errorMessage.includes("Password should be at least")) {
    return "A senha deve ter pelo menos 6 caracteres"
  }

  return errorMessage
}
