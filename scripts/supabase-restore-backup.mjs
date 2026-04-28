import { createReadStream, existsSync } from "node:fs"
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises"
import { basename, dirname, extname, join, resolve, relative, sep } from "node:path"
import { createClient } from "@supabase/supabase-js"

const backupDir = resolve(process.cwd(), process.argv[2] || "")
const targetUrl = process.env.TARGET_SUPABASE_URL
const serviceRoleKey = process.env.TARGET_SUPABASE_SERVICE_ROLE_KEY

if (!process.argv[2]) {
  console.error("Usage: node scripts/supabase-restore-backup.mjs <backup-dir>")
  process.exit(1)
}

if (!existsSync(backupDir)) {
  console.error(`Backup directory not found: ${backupDir}`)
  process.exit(1)
}

if (!targetUrl || !serviceRoleKey) {
  console.error("Missing TARGET_SUPABASE_URL or TARGET_SUPABASE_SERVICE_ROLE_KEY.")
  process.exit(1)
}

const summaryPath = join(backupDir, "summary.json")
const summary = existsSync(summaryPath) ? JSON.parse(await readFile(summaryPath, "utf8")) : null

if (summary?.source === targetUrl && process.env.ALLOW_RESTORE_TO_SOURCE !== "true") {
  console.error("Refusing to restore into the same Supabase URL as the backup source.")
  process.exit(1)
}

const supabase = createClient(targetUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const tableOrder = [
  "plans",
  "solutions",
  "users",
  "profiles",
  "plan_solutions",
  "subscriptions",
  "posts",
  "notifications",
  "user_notifications",
  "email_verification",
  "migrations",
]

const contentTypes = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"))
}

function chunk(items, size) {
  const chunks = []
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size))
  }
  return chunks
}

async function restoreTable(table) {
  const file = join(backupDir, "tables", `${table}.json`)
  if (!existsSync(file)) return { table, count: 0, skipped: true }

  const rows = await readJson(file)
  if (!rows.length) return { table, count: 0, skipped: false }

  let restored = 0
  for (const batch of chunk(rows, 500)) {
    const { error } = await supabase.from(table).upsert(batch, { onConflict: "id" })
    if (error) throw new Error(`${table}: ${error.message}`)
    restored += batch.length
  }

  return { table, count: restored, skipped: false }
}

async function walkFiles(root) {
  const entries = await readdir(root)
  const files = []

  for (const entry of entries) {
    const path = join(root, entry)
    const info = await stat(path)
    if (info.isDirectory()) {
      files.push(...(await walkFiles(path)))
    } else if (basename(path) !== "_files.json") {
      files.push(path)
    }
  }

  return files
}

async function ensureBucket(bucket, isPublic) {
  const { data: existing, error: listError } = await supabase.storage.listBuckets()
  if (listError) throw listError

  if ((existing ?? []).some((item) => item.name === bucket)) {
    await supabase.storage.updateBucket(bucket, { public: isPublic })
    return
  }

  const { error } = await supabase.storage.createBucket(bucket, { public: isPublic })
  if (error) throw error
}

async function restoreBucket(bucketSummary) {
  const bucket = bucketSummary.bucket
  const bucketDir = join(backupDir, "storage", bucket)
  if (!existsSync(bucketDir)) return { bucket, count: 0, skipped: true }

  await ensureBucket(bucket, Boolean(bucketSummary.public))

  const files = await walkFiles(bucketDir)
  let restored = 0

  for (const file of files) {
    const storagePath = relative(bucketDir, file).split(sep).join("/")
    const { error } = await supabase.storage.from(bucket).upload(storagePath, createReadStream(file), {
      cacheControl: "3600",
      contentType: contentTypes[extname(file).toLowerCase()] || "application/octet-stream",
      upsert: true,
    })

    if (error) throw new Error(`${bucket}/${storagePath}: ${error.message}`)
    restored += 1
  }

  return { bucket, count: restored, skipped: false }
}

async function main() {
  const report = {
    target: targetUrl,
    source: summary?.source ?? null,
    backupDir,
    createdAt: new Date().toISOString(),
    authUsers: {
      backupCount: existsSync(join(backupDir, "auth-users.json")) ? (await readJson(join(backupDir, "auth-users.json"))).length : 0,
      restored: false,
      note: "Auth users are not restored by this script because Supabase Auth IDs/password hashes require DB-level migration or manual user recreation.",
    },
    tables: [],
    storage: [],
  }

  console.log(`Restoring backup ${backupDir}`)
  console.log(`Target ${targetUrl}`)

  for (const table of tableOrder) {
    const result = await restoreTable(table)
    report.tables.push(result)
    console.log(`${table}: ${result.skipped ? "skipped" : result.count}`)
  }

  for (const bucket of summary?.storage ?? []) {
    if (!bucket.bucket) continue
    const result = await restoreBucket(bucket)
    report.storage.push(result)
    console.log(`${bucket.bucket}: ${result.skipped ? "skipped" : `${result.count} files`}`)
  }

  const reportPath = resolve(process.cwd(), "backups", `restore-report-${new Date().toISOString().replace(/[:.]/g, "-")}.json`)
  await mkdir(dirname(reportPath), { recursive: true })
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8")
  console.log(`Restore report written to ${reportPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
