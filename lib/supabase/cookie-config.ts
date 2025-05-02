// Configuração padrão de cookies para todos os clientes Supabase
export const cookieOptions = {
  name: "sb-auth-token",
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 dias
  domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined,
}
