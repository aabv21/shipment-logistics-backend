import { IDatabaseConfig } from "./IDatabaseConfig";

export interface IPostgresConfig extends IDatabaseConfig {
  getPoolConfig(): {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
}
