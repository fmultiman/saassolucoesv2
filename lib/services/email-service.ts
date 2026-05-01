import nodemailer from "nodemailer"
import { logError, logInfo } from "@/lib/logger"

type SendEmailInput = {
  to: string
  subject: string
  html: string
  text?: string
}

function resolveSmtpConfig() {
  const host = process.env.SMTP_HOST
  const rawPort = process.env.SMTP_PORT
  const port = Number.parseInt(rawPort || "587", 10)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const secure = process.env.SMTP_SECURE === "true" || port === 465
  const fromEmail = process.env.SMTP_FROM_EMAIL
  const fromName = process.env.SMTP_FROM_NAME || "SaaS Solucoes"

  const missingEnvVars = [
    !host ? "SMTP_HOST" : null,
    !rawPort ? "SMTP_PORT" : null,
    !user ? "SMTP_USER" : null,
    !pass ? "SMTP_PASS" : null,
    !fromEmail ? "SMTP_FROM_EMAIL" : null,
  ].filter((value): value is string => value !== null)

  if (missingEnvVars.length > 0) {
    logError("SMTP_CONFIG_MISSING", {
      missingEnvVars,
    })
    throw new Error(`Configuracao SMTP incompleta. Defina: ${missingEnvVars.join(", ")}.`)
  }

  if (Number.isNaN(port)) {
    logError("SMTP_CONFIG_INVALID_PORT", {
      smtpPort: rawPort,
    })
    throw new Error("Configuracao SMTP invalida. SMTP_PORT precisa ser numerico.")
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

export async function sendEmail({ to, subject, html, text }: SendEmailInput) {
  const smtp = resolveSmtpConfig()
  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: smtp.auth,
  })

  await transporter.sendMail({
    from: smtp.from,
    to,
    subject,
    html,
    text,
  })

  logInfo("EMAIL_SENT", {
    to,
    subject,
  })

  return { success: true }
}

export async function sendWelcomeEmail(email: string, name?: string | null) {
  const normalizedEmail = email.trim().toLowerCase()
  const firstName = name?.trim()?.split(/\s+/)[0] || "Bem-vindo"
  const loginUrl = "https://saas.multihuman.com.br/login"
  const subject = "Bem-vindo ao SaaS Solucoes 🚀"
  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #111827; line-height: 1.6; padding: 24px;">
      <h1 style="font-size: 24px; margin: 0 0 16px;">Bem-vindo ao SaaS Solucoes 🚀</h1>
      <p style="margin: 0 0 12px;">Ola, ${firstName}.</p>
      <p style="margin: 0 0 12px;">
        Sua conta foi criada com sucesso. Agora voce ja pode acessar a plataforma e continuar sua configuracao.
      </p>
      <p style="margin: 24px 0;">
        <a
          href="${loginUrl}"
          style="display: inline-block; padding: 12px 20px; background: #111827; color: #ffffff; text-decoration: none; border-radius: 8px;"
        >
          Acessar a plataforma
        </a>
      </p>
      <p style="margin: 0 0 12px;">Se o botao nao funcionar, copie e cole este link no navegador:</p>
      <p style="margin: 0; word-break: break-all;">
        <a href="${loginUrl}">${loginUrl}</a>
      </p>
    </div>
  `
  const text = [
    "Bem-vindo ao SaaS Solucoes 🚀",
    "",
    `Ola, ${firstName}.`,
    "Sua conta foi criada com sucesso. Agora voce ja pode acessar a plataforma e continuar sua configuracao.",
    "",
    `Acesse: ${loginUrl}`,
  ].join("\n")

  try {
    await sendEmail({
      to: normalizedEmail,
      subject,
      html,
      text,
    })

    logInfo("WELCOME_EMAIL_SENT", {
      email: normalizedEmail,
    })
  } catch (error) {
    logError("WELCOME_EMAIL_FAILED", {
      email: normalizedEmail,
      error,
    })
    throw error
  }
}
