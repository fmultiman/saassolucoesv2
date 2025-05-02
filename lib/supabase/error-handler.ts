/**
 * Traduz erros do Supabase para mensagens amigáveis ao usuário
 */
export function handleSupabaseError(error: any): string {
  console.error("Erro original do Supabase:", error)

  // Se não houver erro, retornar mensagem genérica
  if (!error) return "Ocorreu um erro desconhecido"

  // Verificar se é um erro de timeout
  if (error.message?.includes("timeout") || error.code === 504) {
    return "O servidor está demorando para responder. Por favor, tente novamente mais tarde."
  }

  // Erros comuns de autenticação
  if (error.message?.includes("Email already registered") || error.message?.includes("already in use")) {
    return "Este email já está registrado. Por favor, faça login ou use outro email."
  }

  if (error.message?.includes("Invalid login credentials")) {
    return "Email ou senha incorretos. Por favor, verifique suas credenciais."
  }

  if (error.message?.includes("Email not confirmed")) {
    return "Seu email ainda não foi confirmado. Por favor, verifique sua caixa de entrada."
  }

  if (error.message?.includes("Password should be at least")) {
    return "A senha deve ter pelo menos 6 caracteres."
  }

  if (error.message?.includes("network")) {
    return "Erro de conexão. Verifique sua internet e tente novamente."
  }

  // Retornar a mensagem original se não for um caso conhecido
  return error.message || "Ocorreu um erro inesperado. Por favor, tente novamente."
}
