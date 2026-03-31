import fs from "fs";
import path from "path";
import pool from "./config/db.js";

const migrationsDir = path.join(process.cwd(), "migrations");

const ensureMigrationsTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      filename TEXT PRIMARY KEY,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

const runMigrations = async () => {
  await ensureMigrationsTable();
  const files = fs.readdirSync(migrationsDir).sort();

  for (const file of files) {
    const check = await pool.query(
      "SELECT * FROM migrations WHERE filename = $1",
      [file]
    );

    if (check.rows.length > 0) {
      console.log(`Skipping ${file} (already run)`);
      continue;
    }

    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, "utf-8");

    console.log(`Running migration: ${file}`);
    try {
      await pool.query(sql);
    } catch (err) {
      // Common when DB already has tables but the migrations table was reset/empty.
      const code = err?.code;
      const msg = err?.message || "";
      const alreadyExists =
        code === "42P07" || // duplicate_table
        msg.includes("already exists");

      if (!alreadyExists) throw err;

      console.log(`Skipping ${file} (already applied in DB)`);
    }

    await pool.query(
      "INSERT INTO migrations (filename) VALUES ($1)",
      [file]
    );
  }

  console.log("All migrations executed successfully.");
  process.exit();
};

runMigrations();