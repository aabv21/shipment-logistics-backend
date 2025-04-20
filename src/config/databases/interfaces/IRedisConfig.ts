import { IDatabaseConfig } from "./IDatabaseConfig";

export interface IRedisConfig extends IDatabaseConfig {
  getRedisOptions(): {
    host: string;
    port: number;
    password?: string;
  };
}
