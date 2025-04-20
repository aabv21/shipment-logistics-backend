import { RedisConfig } from "./redis/RedisConfig";
import { PostgresConfig } from "./postgres/PostgresConfig";
import { IRedisConfig } from "./interfaces/IRedisConfig";
import { IPostgresConfig } from "./interfaces/IPostgresConfig";

export class DatabaseFactory {
  private static redisConfig: RedisConfig;
  private static postgresConfig: PostgresConfig;

  static async createRedisConfig(): Promise<IRedisConfig> {
    if (!this.redisConfig) {
      this.redisConfig = new RedisConfig();
      await this.redisConfig.connect();
    }
    return this.redisConfig;
  }

  static async createPostgresConfig(): Promise<IPostgresConfig> {
    if (!this.postgresConfig) {
      this.postgresConfig = new PostgresConfig();
      await this.postgresConfig.initialize();
    }
    return this.postgresConfig;
  }
}
