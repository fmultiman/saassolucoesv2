import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { DEFAULT_PLAN, PLAN_MAPPING } from "@/lib/constants"

type ResolvedPlan = {
  id: number | null
  code: string
  name: string | null
}

function canonicalizePlanCode(plan: string | null | undefined): string {
  if (!plan) return DEFAULT_PLAN

  const normalized = plan
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")

  return PLAN_MAPPING[normalized as keyof typeof PLAN_MAPPING] || normalized || DEFAULT_PLAN
}

export async function resolvePlanFromDatabase(plan: string | null | undefined): Promise<ResolvedPlan> {
  const canonicalCode = canonicalizePlanCode(plan)
  const supabase = createServiceRoleClient()

  const candidateCodes = Array.from(new Set([canonicalCode, DEFAULT_PLAN]))

  for (const code of candidateCodes) {
    const { data } = await supabase.from("plans").select("id, code, name").eq("code", code).maybeSingle()

    if (data) {
      return {
        id: data.id ?? null,
        code: data.code || code,
        name: data.name || null,
      }
    }
  }

  const fallbackNames = Array.from(
    new Set([
      canonicalCode,
      canonicalCode.charAt(0).toUpperCase() + canonicalCode.slice(1),
      DEFAULT_PLAN,
      "Gratuito",
    ]),
  )

  for (const name of fallbackNames) {
    const { data } = await supabase.from("plans").select("id, code, name").ilike("name", name).maybeSingle()

    if (data) {
      return {
        id: data.id ?? null,
        code: data.code || canonicalCode,
        name: data.name || null,
      }
    }
  }

  return {
    id: null,
    code: canonicalCode,
    name: null,
  }
}
