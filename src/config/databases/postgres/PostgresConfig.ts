import pg from "pg";

import { IPostgresConfig } from "../interfaces/IPostgresConfig";
import { runMigration } from "./migrations/001_initial_schema";

const { Pool } = pg;
type PoolType = typeof Pool;

export class PostgresConfig implements IPostgresConfig {
  private pool: InstanceType<PoolType>;

  constructor(
    public readonly host: string = process.env.DB_HOST || "localhost",
    public readonly port: number = parseInt(process.env.DB_PORT || "5432"),
    public readonly username: string = process.env.DB_USER || "postgres",
    public readonly password: string = process.env.DB_PASSWORD || "postgres",
    public readonly database: string = process.env.DB_NAME ||
      "shipment_logistics"
  ) {
    this.pool = new Pool(this.getPoolConfig());
  }

  async initialize(): Promise<void> {
    try {
      const client = await this.pool.connect();
      console.log("Successfully connected to PostgreSQL database");
      client.release();

      await runMigration();
    } catch (error) {
      console.error("Error connecting to the database:", error);
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
    };
  }

  getPool(): InstanceType<PoolType> {
    return this.pool;
  }
}
