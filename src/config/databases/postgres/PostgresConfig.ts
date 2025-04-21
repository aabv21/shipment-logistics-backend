import pg from "pg";

import { IPostgresConfig } from "../interfaces/IPostgresConfig";
import { runMigration } from "./migrations/001_initial_schema";

const { Pool } = pg;
type PoolType = typeof Pool;

export class PostgresConfig implements IPostgresConfig {
  private pool!: InstanceType<PoolType>;
  private static instance: PostgresConfig;

  private constructor(
    public readonly host: string = process.env.DB_HOST || "localhost",
    public readonly port: number = parseInt(process.env.DB_PORT || "5432"),
    public readonly username: string = process.env.DB_USER || "postgres",
    public readonly password: string = process.env.DB_PASSWORD || "postgres",
    public readonly database: string = process.env.DB_NAME ||
      "shipment_logistics"
  ) {
    if (PostgresConfig.instance) {
      return PostgresConfig.instance;
    }

    console.log("Initializing PostgreSQL connection with config:", {
      host: this.host,
      port: this.port,
      user: this.username,
      database: this.database,
    });

    this.pool = new Pool({
      ...this.getPoolConfig(),
      database: "postgres",
    });

    PostgresConfig.instance = this;
  }

  public static getInstance(): PostgresConfig {
    if (!PostgresConfig.instance) {
      PostgresConfig.instance = new PostgresConfig();
    }
    return PostgresConfig.instance;
  }

  async initialize(): Promise<void> {
    try {
      const client = await this.pool.connect();

      try {
        const dbExists = await client.query(
          "SELECT 1 FROM pg_database WHERE datname = $1",
          [this.database]
        );

        if (dbExists.rows.length === 0) {
          await client.query(`CREATE DATABASE ${this.database}`);
          console.log(`✓ Database ${this.database} created successfully`);
        }
      } finally {
        client.release();
      }

      await this.pool.end();

      this.pool = new Pool(this.getPoolConfig());

      const newClient = await this.pool.connect();
      console.log("✓ Successfully connected to PostgreSQL database");
      newClient.release();

      await runMigration(this.pool);
      console.log("✓ Database initialization completed");
    } catch (error) {
      console.error("❌ Error during database initialization:", error);
      throw error;
    }
  }

  getConnectionString(): string {
    return `postgresql://${this.username}:${this.password}@${this.host}:${this.port}/${this.database}`;
  }

  getPoolConfig() {
    return {
      host: this.host,
      port: this.port,
      user: this.username,
      password: this.password,
      database: this.database,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };
  }

  getPool(): InstanceType<PoolType> {
    return this.pool;
  }
}
