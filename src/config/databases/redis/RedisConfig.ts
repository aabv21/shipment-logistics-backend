import { createClient } from "redis";
import { IRedisConfig } from "../interfaces/IRedisConfig";
import { IRedisClient } from "@shared/infrastructure/redis/IRedisClient";

export class RedisConfig implements IRedisConfig, IRedisClient {
  private client!: ReturnType<typeof createClient>;
  private static instance: RedisConfig;

  private constructor(
    public readonly host: string = process.env.REDIS_HOST || "localhost",
    public readonly port: number = parseInt(process.env.REDIS_PORT || "6379"),
    public readonly username: string = process.env.REDIS_USER || "",
    public readonly password: string = process.env.REDIS_PASSWORD || "",
    public readonly database: string = process.env.REDIS_DB || "0"
  ) {
    if (RedisConfig.instance) {
      return RedisConfig.instance;
    }

    this.client = createClient({
      url: this.getConnectionString(),
      password: this.password,
    });

    this.setupEventListeners();
    RedisConfig.instance = this;
  }

  public static getInstance(): RedisConfig {
    if (!RedisConfig.instance) {
      RedisConfig.instance = new RedisConfig();
    }
    return RedisConfig.instance;
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

  // Implementación de IRedisClient
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlInSeconds?: number): Promise<void> {
    if (ttlInSeconds) {
      await this.client.setEx(key, ttlInSeconds, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
