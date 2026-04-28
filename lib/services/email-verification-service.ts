import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { invalidateUserCache } from "./user-service"
import { SITE_URL } from "@/lib/constants"
import { getAuthRedirectUrls } from "@/lib/supabase/auth-helpers"

// Interface para o token de verificação
export interface EmailVerificationToken {
  id: string
  user_id: string
  email: string
  token: string
  created_at: string
  expires_at: string
  verified: boolean
}

// Função para gerar um token aleatório
function generateToken(): string {
  // Gera um token aleatório de 32 caracteres
  return Array.from({ length: 32 }, () => Math.floor(Math.random() * 36).toString(36)).join("")
}

// Função para solicitar mudança de email
export async function requestEmailChange(userId: string, newEmail: string) {
  const supabase = createServiceRoleClient()

  try {
    // Verificar se o email já está em uso
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", newEmail).single()

    if (existingUser) {
      throw new Error("Este email já está em uso por outro usuário")
    }

    // Gerar token e data de expiração (24 horas)
    const token = generateToken()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    // Remover tokens antigos para este usuário
    await supabase.from("email_verification").delete().eq("user_id", userId).eq("verified", false)

    // Inserir novo token
    const { error } = await supabase.from("email_verification").insert({
      user_id: userId,
      email: newEmail,
      token,
      expires_at: expiresAt.toISOString(),
      verified: false,
    })

    if (error) throw error

    // Obter informações do usuário para o email
    const { data: user } = await supabase.from("users").select("name").eq("id", userId).single()

    // Enviar email com link de verificação
    const verificationLink = `${SITE_URL}/verificar-email?token=${token}`

    // Usar o serviço de email do Supabase
    // const { error: emailError } = await supabase.auth.admin.sendRawMagicLink({
    //   email: newEmail,
    //   create_user: false,
    //   redirect_to: verificationLink,
    // })

    // if (emailError) {
    // Fallback: enviar email personalizado se o método acima falhar
    // await sendVerificationEmail(newEmail, user?.name || "Usuário", verificationLink)
    // }

    await sendVerificationEmail(newEmail)

    return { success: true }
  } catch (error) {
    console.error("Erro ao solicitar mudança de email:", error)
    throw error
  }
}

// Função para enviar email de verificação (método alternativo)
async function sendVerificationEmail(email: string) {
  const supabase = createServiceRoleClient()

  // Conteúdo do email
  // const subject = "Confirme seu novo endereço de email - SaaS Soluções"
  // const content = `
  //   <h1>Olá, ${name}!</h1>
  //   <p>Recebemos uma solicitação para alterar seu endereço de email.</p>
  //   <p>Para confirmar seu novo endereço de email, clique no link abaixo:</p>
  //   <p><a href="${verificationLink}" style="padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Confirmar meu email</a></p>
  //   <p>Ou copie e cole o link abaixo no seu navegador:</p>
  //   <p>${verificationLink}</p>
  //   <p>Este link é válido por 24 horas.</p>
  //   <p>Se você não solicitou esta alteração, ignore este email.</p>
  //   <p>Atenciosamente,<br>Equipe SaaS Soluções</p>
  // `

  // Enviar email usando um serviço externo ou implementação personalizada
  // Aqui você pode integrar com SendGrid, Mailgun, Amazon SES, etc.
  // Por enquanto, vamos apenas simular o envio
  // console.log(`Email de verificação enviado para ${email}`)
  // console.log(`Link: ${verificationLink}`)

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: getAuthRedirectUrls().emailRedirectTo,
    },
  })

  return { success: true }
}

// Função para verificar um token
export async function verifyEmailToken(token: string) {
  const supabase = createServiceRoleClient()

  try {
    // Buscar o token
    const { data, error } = await supabase
      .from("email_verification")
      .select("*")
      .eq("token", token)
      .eq("verified", false)
      .single()

    if (error || !data) {
      throw new Error("Token inválido ou já utilizado")
    }

    // Verificar se o token expirou
    if (!data.expires_at || new Date(data.expires_at) < new Date()) {
      throw new Error("Token expirado")
    }

    if (!data.email || !data.user_id) {
      throw new Error("Token sem usuario ou email vinculado")
    }

    // Atualizar o email do usuário
    const { error: updateError } = await supabase
      .from("users")
      .update({
        email: data.email,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.user_id)

    if (updateError) throw updateError

    // Marcar o token como verificado
    await supabase.from("email_verification").update({ verified: true }).eq("id", data.id)

    // Invalidar cache do usuário
    await invalidateUserCache(data.user_id)

    return {
      success: true,
      userId: data.user_id,
      email: data.email,
    }
  } catch (error) {
    console.error("Erro ao verificar token:", error)
    throw error
  }
}

// Função para obter tokens pendentes de um usuário
export async function getPendingEmailVerifications(userId: string) {
  const supabase = createServiceRoleClient()

  try {
    const { data, error } = await supabase
      .from("email_verification")
      .select("*")
      .eq("user_id", userId)
      .eq("verified", false)
      .order("created_at", { ascending: false })

    if (error) throw error

    return data as EmailVerificationToken[]
  } catch (error) {
    console.error("Erro ao buscar verificações pendentes:", error)
    throw error
  }
}

// Função para cancelar uma solicitação de mudança de email
export async function cancelEmailChange(tokenId: string) {
  const supabase = createServiceRoleClient()

  try {
    const { error } = await supabase.from("email_verification").delete().eq("id", tokenId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Erro ao cancelar mudança de email:", error)
    throw error
  }
}
