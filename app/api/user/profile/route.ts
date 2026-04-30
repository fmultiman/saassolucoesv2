import { NextResponse } from "next/server"
import { z } from "zod"
import { requireUser } from "@/lib/auth/requireUser"
import { apiErrorResponse, logApiError } from "@/lib/errors"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

const profileUpdateSchema = z
  .object({
    name: z.string().min(2).max(100).nullable().optional(),
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

export async function GET() {
  try {
    const currentUser = await requireUser()

    return NextResponse.json({
      user: currentUser.profile,
      profile: currentUser.settingsProfile,
    })
  } catch (error) {
    logApiError("api/user/profile GET", error)
    return apiErrorResponse(error)
  }
}

export async function PUT(request: Request) {
  try {
    const currentUser = await requireUser()
    const profileData = profileUpdateSchema.parse(await request.json())
    const supabase = createServiceRoleClient()

    const cleanedProfileData = Object.fromEntries(Object.entries(profileData).filter(([, value]) => value !== undefined))

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: currentUser.profile.id,
          email: currentUser.profile.email,
          ...(profileData.name !== undefined ? { name: profileData.name } : {}),
          ...cleanedProfileData,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      )

    if (profileError) {
      throw profileError
    }

    if (profileData.name !== undefined) {
      const { error: userError } = await supabase
        .from("users")
        .update({
          name: profileData.name,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentUser.profile.id)

      if (userError) {
        throw userError
      }
    }

    const { data: refreshedProfile, error: refreshedProfileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.profile.id)
      .maybeSingle()

    if (refreshedProfileError) {
      throw refreshedProfileError
    }

    const { data: refreshedUser, error: refreshedUserError } = await supabase
      .from("users")
      .select("*")
      .eq("id", currentUser.profile.id)
      .single()

    if (refreshedUserError) {
      throw refreshedUserError
    }

    return NextResponse.json({
      success: true,
      message: "Perfil atualizado com sucesso",
      user: refreshedUser,
      profile: refreshedProfile ?? null,
    })
  } catch (error) {
    logApiError("api/user/profile PUT", error)
    return apiErrorResponse(error)
  }
}
