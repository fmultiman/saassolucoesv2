/**
 * Retorna as URLs de redirecionamento para autenticação
 */
export function getAuthRedirectUrls() {
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "https://saas.multihuman.com.br"

  return {
    emailRedirectTo: `${baseUrl}/auth/verify`,
    resetPasswordRedirectTo: `${baseUrl}/auth/reset-password`,
  }
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
