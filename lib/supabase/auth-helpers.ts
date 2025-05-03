/**
 * Retorna as URLs de redirecionamento para autenticação
 */
export function getAuthRedirectUrls() {
  // Prioridade: 1. URL do site em produção, 2. window.location.origin, 3. localhost
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")

  // Garantir que não há barras duplicadas
  const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl

  // Log para depuração (apenas em desenvolvimento)
  if (process.env.NODE_ENV === "development") {
    console.log("Base URL para redirecionamento:", normalizedBaseUrl)
  }

  return {
    emailRedirectTo: `${normalizedBaseUrl}/auth/verify`,
    resetPasswordRedirectTo: `${normalizedBaseUrl}/auth/reset-password`,
  }
}

/**
 * Função de debug para verificar URLs de redirecionamento
 */
export function logAuthRedirectUrls() {
  const urls = getAuthRedirectUrls()
  console.log("=== URLs de Redirecionamento de Autenticação ===")
  console.log("Email Redirect:", urls.emailRedirectTo)
  console.log("Reset Password Redirect:", urls.resetPasswordRedirectTo)
  console.log("NEXT_PUBLIC_SITE_URL:", process.env.NEXT_PUBLIC_SITE_URL)
  console.log("window.location.origin:", typeof window !== "undefined" ? window.location.origin : "N/A (server)")
  console.log("================================================")
  return urls
}

/**
 * Formata mensagens de erro de autenticação para exibição ao usuário
 */
export function formatAuthError(error: any): string {
  if (!error) return "Ocorreu um erro desconhecido"

  const errorMessage = error.message || error.toString()

  if (errorMessage.includes("Invalid login credentials")) {
    return "Email ou senha incorretos"
  }

  if (errorMessage.includes("Email not confirmed")) {
    return "Email não confirmado. Por favor, verifique sua caixa de entrada"
  }

  if (errorMessage.includes("already registered")) {
    return "Este email já está registrado"
  }

  if (errorMessage.includes("Password should be at least")) {
    return "A senha deve ter pelo menos 6 caracteres"
  }

  return errorMessage
}
