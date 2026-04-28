import { mkdir, writeFile } from "node:fs/promises"
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
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

const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
const backupDir = resolve(process.cwd(), "backups", `supabase-old-${timestamp}`)

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

async function writeJson(path, data) {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`, "utf8")
}

async function backupAuthUsers() {
  const users = []
  let page = 1
  const perPage = 1000

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage })
    if (error) throw error

    users.push(...(data.users ?? []))
    if (!data.users || data.users.length < perPage) break
    page += 1
  }

  await writeJson(resolve(backupDir, "auth-users.json"), users)
  return users.length
}

async function backupTable(table) {
  const rows = []
  const pageSize = 1000
  let from = 0

  while (true) {
    const { data, error } = await supabase.from(table).select("*").range(from, from + pageSize - 1)
    if (error) {
      await writeJson(resolve(backupDir, "table-errors", `${table}.json`), { table, error: error.message })
      return { table, count: null, error: error.message }
    }

    rows.push(...(data ?? []))
    if (!data || data.length < pageSize) break
    from += pageSize
  }

  await writeJson(resolve(backupDir, "tables", `${table}.json`), rows)
  return { table, count: rows.length, error: null }
}

async function listStorageFiles(bucket, prefix = "") {
  const files = []
  const { data, error } = await supabase.storage.from(bucket).list(prefix, {
    limit: 1000,
    offset: 0,
  })

  if (error) throw error

  for (const item of data ?? []) {
    const path = prefix ? `${prefix}/${item.name}` : item.name

    if (item.id === null) {
      files.push(...(await listStorageFiles(bucket, path)))
    } else {
      files.push(path)
    }
  }

  return files
}

async function backupStorageBucket(bucket) {
  const files = await listStorageFiles(bucket)
  await writeJson(resolve(backupDir, "storage", bucket, "_files.json"), files)

  for (const file of files) {
    const { data, error } = await supabase.storage.from(bucket).download(file)
    if (error) {
      await writeJson(resolve(backupDir, "storage-errors", bucket, `${file}.json`), {
        bucket,
        file,
        error: error.message,
      })
      continue
    }

    const arrayBuffer = await data.arrayBuffer()
    const target = resolve(backupDir, "storage", bucket, file)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, Buffer.from(arrayBuffer))
  }

  return files.length
}

async function main() {
  await mkdir(backupDir, { recursive: true })

  const summary = {
    source: supabaseUrl,
    createdAt: new Date().toISOString(),
    authUsers: 0,
    tables: [],
    storage: [],
  }

  console.log(`Writing backup to ${backupDir}`)

  summary.authUsers = await backupAuthUsers()

  for (const table of tables) {
    const result = await backupTable(table)
    summary.tables.push(result)
    console.log(`${table}: ${result.error ? `error - ${result.error}` : result.count}`)
  }

  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
  if (bucketsError) {
    summary.storage.push({ error: bucketsError.message })
  } else {
    for (const bucket of buckets ?? []) {
      const count = await backupStorageBucket(bucket.name)
      summary.storage.push({ bucket: bucket.name, public: bucket.public, files: count })
      console.log(`${bucket.name}: ${count} files`)
    }
  }

  await writeJson(resolve(backupDir, "summary.json"), summary)
  console.log("Backup complete.")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

