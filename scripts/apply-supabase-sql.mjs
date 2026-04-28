import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import pg from "pg"

const sqlFile = process.argv[2]
const databaseUrl = process.env.TARGET_DATABASE_URL

if (!sqlFile) {
  console.error("Usage: node scripts/apply-supabase-sql.mjs <sql-file>")
  process.exit(1)
}

if (!databaseUrl) {
  console.error("Missing TARGET_DATABASE_URL.")
  process.exit(1)
}

const client = new pg.Client({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
})

try {
  const sql = await readFile(resolve(process.cwd(), sqlFile), "utf8")
  await client.connect()
  await client.query(sql)
  console.log(`Applied SQL file: ${sqlFile}`)
} finally {
  await client.end()
}
