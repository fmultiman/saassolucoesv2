import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { createClient } from "@supabase/supabase-js"

const envPath = resolve(process.cwd(), ".env.local")
const envText = readFileSync(envPath, "utf8")

for (const line of envText.split(/\r?\n/)) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith("#")) continue

  const separator = trimmed.indexOf("=")
  if (separator === -1) continue

  const key = trimmed.slice(0, separator).trim()
  const value = trimmed.slice(separator + 1).trim()
  process.env[key] = value
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const tables = [
  "users",
  "profiles",
  "solutions",
  "plans",
  "plan_solutions",
  "subscriptions",
  "posts",
  "notifications",
  "user_notifications",
  "email_verification",
  "email_change_requests",
  "migrations",
]

async function getTableCount(table) {
  const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true })

  if (error) {
    return { table, exists: false, count: null, error: error.message }
  }

  return { table, exists: true, count, error: null }
}

async function main() {
  console.log(`Supabase inventory for ${supabaseUrl}`)
  console.log("")

  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 })
  if (authError) {
    console.log(`auth.users: error - ${authError.message}`)
  } else {
    console.log(`auth.users: ${authUsers?.total ?? "unknown"} users`)
  }

  console.log("")
  console.log("Tables:")
  const tableResults = await Promise.all(tables.map(getTableCount))
  for (const result of tableResults) {
    if (result.exists) {
      console.log(`- ${result.table}: ${result.count ?? 0}`)
    } else {
      console.log(`- ${result.table}: missing/error (${result.error})`)
    }
  }

  console.log("")
  console.log("Storage buckets:")
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
  if (bucketsError) {
    console.log(`- error: ${bucketsError.message}`)
  } else if (!buckets?.length) {
    console.log("- none")
  } else {
    for (const bucket of buckets) {
      console.log(`- ${bucket.name} (public: ${bucket.public})`)
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

