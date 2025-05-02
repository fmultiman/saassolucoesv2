import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { z } from "zod"

// Schema de validação para atualização de perfil
const profileUpdateSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100).nullable().optional(),
    bio: z.string().max(500).nullable().optional(),
    phone: z.string().max(20).nullable().optional(),
    job_title: z.string().max(100).nullable().optional(),
    company: z.string().max(100).nullable().optional(),
    website: z.string().url().nullable().optional().or(z.string().max(100).nullable()),
    location: z.string().max(100).nullable().optional(),
    avatar_url: z.string().url().nullable().optional().or(z.string().max(500).nullable()),
    preferences: z.record(z.any()).nullable().optional(),
    company_name: z.string().max(100).nullable().optional(),
    company_size: z.string().max(50).nullable().optional(),
    industry: z.string().max(100).nullable().optional(),
    address: z.string().max(200).nullable().optional(),
    city: z.string().max(100).nullable().optional(),
    state: z.string().max(100).nullable().optional(),
    country: z.string().max(100).nullable().optional(),
    postal_code: z.string().max(20).nullable().optional(),
    social_links: z.record(z.string()).nullable().optional(),
  })
  .partial()

export async function PUT(request: Request) {
  try {
    const supabase = createClient(cookies())

    // Verificar autenticação
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Obter dados do corpo da requisição
    const body = await request.json()
    console.log("Dados recebidos para atualização:", body)

    // Validar dados
    const validationResult = profileUpdateSchema.safeParse(body)

    if (!validationResult.success) {
      console.error("Erro de validação:", validationResult.error.format())
      return NextResponse.json({ error: "Dados inválidos", details: validationResult.error.format() }, { status: 400 })
    }

    const validData = validationResult.data
    console.log("Dados validados:", validData)

    // Remover campos undefined ou null antes de atualizar
    const cleanData = Object.fromEntries(Object.entries(validData).filter(([_, v]) => v !== undefined))

    // Adicionar updated_at
    const dataToUpdate = {
      ...cleanData,
      updated_at: new Date().toISOString(),
    }

    // Verificar se o perfil já existe
    const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", session.user.id).single()

    if (existingProfile) {
      // Atualizar perfil existente
      const { error } = await supabase.from("profiles").update(dataToUpdate).eq("id", session.user.id)

      if (error) {
        console.error("Erro ao atualizar perfil:", error)
        return NextResponse.json({ error: "Erro ao atualizar perfil", details: error }, { status: 500 })
      }
    } else {
      // Criar novo perfil
      const { error } = await supabase.from("profiles").insert({
        id: session.user.id,
        ...dataToUpdate,
        created_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Erro ao criar perfil:", error)
        return NextResponse.json({ error: "Erro ao criar perfil", details: error }, { status: 500 })
      }
    }

    console.log("Perfil atualizado com sucesso")
    return NextResponse.json({ success: true, message: "Perfil atualizado com sucesso" })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createClient(cookies())

    // Verificar autenticação
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Buscar dados do usuário
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .single()

    if (userError) {
      console.error("Erro ao buscar usuário:", userError)
      return NextResponse.json({ error: "Erro ao buscar usuário", details: userError }, { status: 500 })
    }

    // Buscar dados do perfil
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single()

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Erro ao buscar perfil:", profileError)
      return NextResponse.json({ error: "Erro ao buscar perfil", details: profileError }, { status: 500 })
    }

    return NextResponse.json({
      user: userData,
      profile: profileData || null,
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
