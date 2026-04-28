// Configuração centralizada para autenticação com Supabase
import { createClient } from "@supabase/supabase-js"
import { getAuthRedirectUrls } from "./auth-helpers"
import { getSupabasePublishableKey, getSupabaseUrl } from "./env"

// Obter URLs de redirecionamento
const { emailRedirectTo } = getAuthRedirectUrls()

// Constantes para configuração de autenticação
export const SUPABASE_AUTH_CONFIG = {
  // Configurações de redirecionamento
  redirectTo: emailRedirectTo,

  // Configurações de cookies
  cookieOptions: {
    name: "sb-auth-token",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  },

  // Configurações de email
  emailRedirectTo: emailRedirectTo,
}

// Função para criar um cliente Supabase com configurações padrão
export function createAuthClient() {
  return createClient(
    getSupabaseUrl() || "",
    getSupabasePublishableKey() || "",
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    }
  )
}
