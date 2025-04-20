import pkg from "pg";
const { Pool } = pkg;
import { readFileSync } from "fs";
import { join } from "path";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
});

// Function to check if tables exist
async function checkTablesExist() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN (
        'users', 'addresses', 'carriers', 'vehicles', 
        'routes', 'packages', 'shipments', 
        'shipment_status_history', 'reports'
      )
    `);

    return result.rows.length > 0;
  } catch (error) {
    console.error("Error checking tables:", error);
    return false;
  } finally {
    client.release();
  }
}

export async function runMigration() {
  const client = await pool.connect();
  try {
    // Check if tables exist
    const tablesExist = await checkTablesExist();
    if (tablesExist) {
      console.log("Tables already exist, skipping migration");
      return;
    }

    // Start transaction
    await client.query("BEGIN");

    // Read and execute schema.sql
    const schemaPath = join(
      process.cwd(),
      "src/config/databases/postgres/schema.sql"
    );
    const schemaSQL = readFileSync(schemaPath, "utf8");

    // Execute schema
    await client.query(schemaSQL);

    // Commit transaction
    await client.query("COMMIT");
    console.log("Migration completed successfully");
  } catch (error) {
    // Rollback on error
    await client.query("ROLLBACK");
    console.error("Migration failed:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Function to check if database is ready
async function waitForDatabase() {
  let retries = 5;
  while (retries > 0) {
    try {
      const client = await pool.connect();
      client.release();
      return true;
    } catch (error) {
      console.log(`Waiting for database... ${retries} retries left`);
      retries--;
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
    }
  }
  throw new Error("Could not connect to database after multiple retries");
}

// Execute migration
export const main = async () => {
  try {
    console.log("Waiting for database to be ready...");
    await waitForDatabase();
    console.log("Database is ready, checking if migration is needed...");
    await runMigration();
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};
