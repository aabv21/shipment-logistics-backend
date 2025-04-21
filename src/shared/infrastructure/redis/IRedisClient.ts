export interface IRedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlInSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
}
