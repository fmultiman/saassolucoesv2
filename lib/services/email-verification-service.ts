import { randomBytes } from "crypto"
import nodemailer from "nodemailer"
import { SITE_URL } from "@/lib/constants"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { invalidateUserCache } from "./user-service"

export interface EmailVerificationToken {
  id: string
  user_id: string
  email: string
  token: string
  created_at: string
  expires_at: string
  verified: boolean
}

function generateToken(): string {
  return randomBytes(32).toString("hex")
}

function buildVerificationLink(token: string) {
  const normalizedBaseUrl = SITE_URL.endsWith("/") ? SITE_URL.slice(0, -1) : SITE_URL
  return `${normalizedBaseUrl}/verificar-email?token=${encodeURIComponent(token)}`
}

function resolveSmtpConfig() {
  const host = process.env.SMTP_HOST
  const port = Number.parseInt(process.env.SMTP_PORT || "587", 10)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const secure = process.env.SMTP_SECURE === "true" || port === 465
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_FROM || user
  const fromName = process.env.SMTP_FROM_NAME || "SaaS Solucoes"

  if (!host || !user || !pass || !fromEmail) {
    throw new Error("Configuracao SMTP incompleta. Defina SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS e SMTP_FROM_EMAIL.")
  }

  return {
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    from: `"${fromName}" <${fromEmail}>`,
  }
}

function buildVerificationEmailContent(verificationLink: string) {
  const subject = "Confirme seu novo email"
  const html = `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <h1 style="font-size: 24px; margin-bottom: 16px;">Confirme seu novo email</h1>
      <p>Recebemos uma solicitacao para alterar o endereco de email da sua conta.</p>
      <p>Para concluir a alteracao, clique no botao abaixo:</p>
      <p style="margin: 24px 0;">
        <a
          href="${verificationLink}"
          style="display: inline-block; padding: 12px 20px; background: #111827; color: #ffffff; text-decoration: none; border-radius: 8px;"
        >
          Confirmar novo email
        </a>
      </p>
      <p>Se o botao nao funcionar, copie e cole este link no navegador:</p>
      <p style="word-break: break-all;"><a href="${verificationLink}">${verificationLink}</a></p>
      <p>Este link expira em 24 horas.</p>
      <p>Se voce nao solicitou essa alteracao, ignore este email.</p>
    </div>
  `
  const text = [
    "Confirme seu novo email",
    "",
    "Recebemos uma solicitacao para alterar o endereco de email da sua conta.",
    "Acesse o link abaixo para concluir a alteracao:",
    verificationLink,
    "",
    "Este link expira em 24 horas.",
    "Se voce nao solicitou essa alteracao, ignore este email.",
  ].join("\n")

  return { subject, html, text }
}

export async function requestEmailChange(userId: string, newEmail: string) {
  const supabase = createServiceRoleClient()
  const normalizedEmail = newEmail.trim().toLowerCase()

  try {
    const { data: existingUser, error: existingUserError } = await supabase
      .from("users")
      .select("id")
      .eq("email", normalizedEmail)
      .neq("id", userId)
      .maybeSingle()

    if (existingUserError) throw existingUserError

    if (existingUser) {
      throw new Error("Este email ja esta em uso por outro usuario")
    }

    const token = generateToken()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    const { error: deletePendingError } = await supabase
      .from("email_verification")
      .delete()
      .eq("user_id", userId)
      .eq("verified", false)

    if (deletePendingError) throw deletePendingError

    const { error: insertError } = await supabase.from("email_verification").insert({
      user_id: userId,
      email: normalizedEmail,
      token,
      expires_at: expiresAt,
      verified: false,
    })

    if (insertError) throw insertError

    const verificationLink = buildVerificationLink(token)
    await sendVerificationEmail(normalizedEmail, verificationLink)

    console.info("[email-change] verification email queued", { userId, email: normalizedEmail })

    return { success: true }
  } catch (error) {
    console.error("[email-change] failed to request email change", { userId, email: normalizedEmail, error })
    throw error
  }
}

async function sendVerificationEmail(email: string, verificationLink: string) {
  const smtp = resolveSmtpConfig()
  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: smtp.auth,
  })

  const { subject, html, text } = buildVerificationEmailContent(verificationLink)

  await transporter.sendMail({
    from: smtp.from,
    to: email,
    subject,
    html,
    text,
  })

  console.info("[email-change] verification email sent", { email })
  return { success: true }
}

export async function verifyEmailToken(token: string) {
  const supabase = createServiceRoleClient()

  try {
    const normalizedToken = token.trim()
    const nowIso = new Date().toISOString()

    const { data: tokenRow, error: tokenError } = await supabase
      .from("email_verification")
      .select("*")
      .eq("token", normalizedToken)
      .eq("verified", false)
      .gt("expires_at", nowIso)
      .maybeSingle()

    if (tokenError) throw tokenError

    if (!tokenRow) {
      console.warn("[email-change] invalid or already used token", { token: normalizedToken })
      throw new Error("invalid_token")
    }

    if (!tokenRow.user_id || !tokenRow.email) {
      console.error("[email-change] token missing required fields", { tokenId: tokenRow.id })
      throw new Error("invalid_token")
    }

    const { data: claimedToken, error: claimError } = await supabase
      .from("email_verification")
      .update({ verified: true })
      .eq("id", tokenRow.id)
      .eq("verified", false)
      .gt("expires_at", nowIso)
      .select("*")
      .maybeSingle()

    if (claimError) throw claimError

    if (!claimedToken) {
      console.warn("[email-change] token reuse prevented", { tokenId: tokenRow.id })
      throw new Error("invalid_token")
    }

    const rollbackToken = async () => {
      await supabase.from("email_verification").update({ verified: false }).eq("id", tokenRow.id)
    }

    const { error: authUpdateError } = await supabase.auth.admin.updateUserById(tokenRow.user_id, {
      email: tokenRow.email,
      email_confirm: true,
    })

    if (authUpdateError) {
      await rollbackToken()
      console.error("[email-change] failed to update auth email", { userId: tokenRow.user_id, error: authUpdateError })
      throw authUpdateError
    }

    const { error: userUpdateError } = await supabase
      .from("users")
      .update({
        email: tokenRow.email,
        updated_at: new Date().toISOString(),
      })
      .eq("id", tokenRow.user_id)

    if (userUpdateError) {
      await rollbackToken()
      console.error("[email-change] failed to update public.users email", { userId: tokenRow.user_id, error: userUpdateError })
      throw userUpdateError
    }

    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({
        email: tokenRow.email,
        updated_at: new Date().toISOString(),
      })
      .eq("id", tokenRow.user_id)

    if (profileUpdateError) {
      await rollbackToken()
      console.error("[email-change] failed to update profile email", { userId: tokenRow.user_id, error: profileUpdateError })
      throw profileUpdateError
    }

    await invalidateUserCache(tokenRow.user_id)

    console.info("[email-change] email updated successfully", { userId: tokenRow.user_id, email: tokenRow.email })

    return {
      success: true,
      userId: tokenRow.user_id,
      email: tokenRow.email,
    }
  } catch (error) {
    if (error instanceof Error && error.message === "invalid_token") {
      throw error
    }

    console.error("[email-change] verification flow failed", { error })
    throw error
  }
}

export async function getPendingEmailVerifications(userId: string) {
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from("email_verification")
    .select("*")
    .eq("user_id", userId)
    .eq("verified", false)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[email-change] failed to fetch pending verifications", { userId, error })
    throw error
  }

  return data as EmailVerificationToken[]
}

export async function cancelEmailChange(tokenId: string) {
  const supabase = createServiceRoleClient()

  const { error } = await supabase.from("email_verification").delete().eq("id", tokenId)

  if (error) {
    console.error("[email-change] failed to cancel email change", { tokenId, error })
    throw error
  }

  return { success: true }
}
