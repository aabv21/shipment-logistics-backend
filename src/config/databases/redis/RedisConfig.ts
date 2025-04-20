import { createClient } from "redis";
import { IRedisConfig } from "../interfaces/IRedisConfig";

export class RedisConfig implements IRedisConfig {
  private client: ReturnType<typeof createClient>;

  constructor(
    public readonly host: string = process.env.REDIS_HOST || "localhost",
    public readonly port: number = parseInt(process.env.REDIS_PORT || "6379"),
    public readonly username: string = process.env.REDIS_USER || "",
    public readonly password: string = process.env.REDIS_PASSWORD || "",
    public readonly database: string = process.env.REDIS_DB || "0"
  ) {
    this.client = createClient({
      url: this.getConnectionString(),
      password: this.password,
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.client.on("error", (err) => console.error("Redis Client Error", err));
    this.client.on("connect", () =>
      console.log("Successfully connected to Redis")
    );
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  getConnectionString(): string {
    return `redis://${this.username}:${this.password}@${this.host}:${this.port}/${this.database}`;
  }

  getRedisOptions() {
    return {
      host: this.host,
      port: this.port,
      ...(this.password && { password: this.password }),
    };
  }

  getClient(): ReturnType<typeof createClient> {
    return this.client;
  }
}
