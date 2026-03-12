import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const migrationsDir = path.resolve(process.cwd(), "../database/postgres/migrations");

async function ensureMigrationTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      filename VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function getAppliedMigrations() {
  const result = await pool.query("SELECT filename FROM schema_migrations");
  return new Set(result.rows.map((row) => row.filename));
}

async function run() {
  await ensureMigrationTable();
  const applied = await getAppliedMigrations();
  const files = (await fs.readdir(migrationsDir))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`SKIP ${file}`);
      continue;
    }

    const sql = await fs.readFile(path.join(migrationsDir, file), "utf8");
    await pool.query("BEGIN");

    try {
      await pool.query(sql);
      await pool.query(
        "INSERT INTO schema_migrations (filename) VALUES ($1)",
        [file]
      );
      await pool.query("COMMIT");
      console.log(`APPLY ${file}`);
    } catch (error) {
      await pool.query("ROLLBACK");
      console.error(`FAILED ${file}`);
      console.error(error);
      process.exit(1);
    }
  }

  await pool.end();
}

run().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exit(1);
});
