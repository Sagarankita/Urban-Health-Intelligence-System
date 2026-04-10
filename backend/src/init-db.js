import fs from "fs";
import path from "path";
import pool from "./config/db.js";

const migrationsDir = path.join(process.cwd(), "migrations");
const seedDir = path.join(process.cwd(), "seed");

const ensureMigrationsTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations_meta (
      filename TEXT PRIMARY KEY,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

const hasRunMigration = async (filename) => {
  const result = await pool.query(
    "SELECT 1 FROM migrations_meta WHERE filename=$1 LIMIT 1",
    [filename]
  );
  return result.rowCount > 0;
};

const markMigrationRan = async (filename) => {
  await pool.query(
    "INSERT INTO migrations_meta (filename) VALUES ($1) ON CONFLICT DO NOTHING",
    [filename]
  );
};

const runSqlFile = async (filePath) => {
  const sql = fs.readFileSync(filePath, "utf-8");
  await pool.query(sql);
};

const runMigrations = async () => {
  await ensureMigrationsTable();

  const files = fs.readdirSync(migrationsDir).sort();
  for (const file of files) {
    if (await hasRunMigration(file)) continue;

    const filePath = path.join(migrationsDir, file);
    try {
      console.log(`Running migration: ${file}`);
      await runSqlFile(filePath);
      await markMigrationRan(file);
    } catch (err) {
      // If the DB is already migrated but meta is missing, skip common "already exists" cases.
      const msg = err?.message || "";
      const code = err?.code;
      const alreadyExists =
        code === "42P07" || // duplicate_table
        msg.includes("already exists") ||
        msg.includes("relation") && msg.includes("exists");

      if (alreadyExists) {
        console.log(`Skipping migration (already applied): ${file}`);
        await markMigrationRan(file);
        continue;
      }

      throw err;
    }
  }
};

const runSeeds = async () => {
  const files = fs
    .readdirSync(seedDir)
    .sort()
    .filter((f) => f.endsWith(".sql"));

  for (const file of files) {
    const filePath = path.join(seedDir, file);
    console.log(`Running seed: ${file}`);
    await runSqlFile(filePath);
  }
};

async function main() {
  const migrateOnly = process.argv.includes("--migrate-only");
  const seedOnly = process.argv.includes("--seed-only");

  try {
    if (!seedOnly) await runMigrations();
    if (!migrateOnly) await runSeeds();
    console.log("DB init completed.");
  } catch (err) {
    console.error("DB init failed:", err);
    process.exitCode = 1;
  } finally {
    // Ensure we terminate the process even if pool is still open.
    await pool.end();
  }
}

main();

