import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { getCurrentApiUser } from "@/lib/api-auth"
import { resolvePlanFromDatabase } from "@/lib/plan-utils"

export async function POST(request: Request) {
  try {
    const supabaseAdmin = createServiceRoleClient()

    const { nome, email, tipoAcesso, plano, forceCreate } = await request.json()
    const { user, userType: requesterType } = await getCurrentApiUser()

    if (!nome || !email) {
      return NextResponse.json({ error: "Nome e email são obrigatórios" }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const isAdminRequest = requesterType === "admin"

    if (!isAdminRequest) {
      if (!user || user.email?.toLowerCase() !== normalizedEmail || tipoAcesso === "admin" || forceCreate) {
        return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
      }
    }

    const userType = isAdminRequest && tipoAcesso === "admin" ? "admin" : "client"
    const resolvedPlan = await resolvePlanFromDatabase(plano)
    const userPlan = userType === "client" ? resolvedPlan.code : DEFAULT_ADMIN_PLAN

    // 🔍 Verificar se já existe na tabela users
    const { data: userInTable, error: tableError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle()

    if (tableError) throw tableError

    // 🔍 Verificar se já existe no auth
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()
    if (authError) throw authError

    const existingAuthUser = authUsers?.users?.find((user) => user.email?.toLowerCase() === normalizedEmail)

    if ((userInTable || existingAuthUser) && !(isAdminRequest && forceCreate)) {
      return NextResponse.json({ error: "Usuário com este email já existe" }, { status: 400 })
    }

    let userId = existingAuthUser?.id

    // 👤 Criar no auth se não existir
    if (!existingAuthUser) {
      const password = generateTemporaryPassword()

      const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: normalizedEmail,
        password,
        email_confirm: true,
        user_metadata: {
          name: nome,
          tipo: userType,
          plano: userType === "client" ? userPlan : null,
          plan_id: userType === "client" ? resolvedPlan.id : null,
        },
      })

      if (createError || !created?.user?.id) {
        return NextResponse.json({ error: createError?.message || "Erro ao criar usuário no auth" }, { status: 500 })
      }

      userId = created.user.id
    }

    if (!userId) {
      return NextResponse.json({ error: "Nao foi possivel identificar o usuario" }, { status: 500 })
    }

    // 🔄 Atualizar ou inserir na tabela users
    const { data: existing, error: findUserError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("id", userId)
      .maybeSingle()

    if (findUserError) throw findUserError

    if (existing) {
      // Atualizar
      const { error: updateError } = await supabaseAdmin
        .from("users")
        .update({
          name: nome,
          email: normalizedEmail,
          user_type: userType,
          plan: userPlan,
          plan_id: userType === "client" ? resolvedPlan.id : null,
          status: "active",
        })
        .eq("id", userId)

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }

      return NextResponse.json({
        message: "Usuário atualizado com sucesso",
        userId,
        action: "updated",
      })
    } else {
      // Inserir
      const { error: insertError } = await supabaseAdmin.from("users").insert({
        id: userId,
        name: nome,
        email: normalizedEmail,
        user_type: userType,
        plan: userPlan,
        plan_id: userType === "client" ? resolvedPlan.id : null,
        status: "active",
      })

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }

      return NextResponse.json({
        message: "Usuário criado com sucesso",
        userId,
        action: "created",
      })
    }
  } catch (err: any) {
    console.error("Erro geral:", err)
    return NextResponse.json({ error: err.message || "Erro inesperado" }, { status: 500 })
  }
}

const DEFAULT_ADMIN_PLAN = "free"

function generateTemporaryPassword(length = 12) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%*"
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}
