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

    this.pool = new Pool(this.getPoolConfig());
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
      // Test connection
      console.log("Testing database connection...");
      const client = await this.pool.connect();
      console.log("✓ Successfully connected to PostgreSQL database");
      client.release();

      // Run migrations with the same pool instance
      console.log("Starting database migrations...");
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
      // Add some connection pool settings
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
      connectionTimeoutMillis: 2000, // How long to wait for a connection
    };
  }

  getPool(): InstanceType<PoolType> {
    return this.pool;
  }
}
