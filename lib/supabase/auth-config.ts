// Configuração centralizada para autenticação com Supabase
import { createClient } from "@supabase/supabase-js"

// Constantes para configuração de autenticação
export const SUPABASE_AUTH_CONFIG = {
  // Configurações de redirecionamento
  redirectTo: process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify`
    : "http://localhost:3000/auth/verify",

  // Configurações de cookies
  cookieOptions: {
    name: "sb-auth-token",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  },

  // Configurações de email
  emailRedirectTo: process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify`
    : "http://localhost:3000/auth/verify",
}

// Função para criar um cliente Supabase com configurações padrão
export function createAuthClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "", {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
}
