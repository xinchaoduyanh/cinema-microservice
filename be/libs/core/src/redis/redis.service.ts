import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from './redis.constant';

export type CacheOptions<T> = {
  /** A stable, namespaced Redis key, e.g. `movie:list:page=1`. */
  key: string;
  /** TTL in seconds. The default is 5 minutes. */
  ttlSeconds?: number;
  /** Called only when the key is absent. */
  loader: () => Promise<T>;
};

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async setValue<T = any>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    if (ttlSeconds) {
      await this.redis.set(key, serialized, 'EX', ttlSeconds);
    } else {
      await this.redis.set(key, serialized);
    }
  }

  async getValue<T = any>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    if (!data) return null;

    try {
      const parsed = JSON.parse(data);

      if (typeof parsed !== 'object') {
        // handle string to be converted to number (e.g., '123' -> 123 while T = string)
        return data as unknown as T;
      }

      return parsed as T;
    } catch {
      return data as unknown as T;
    }
  }

  /**
   * Read-through cache. Services only provide a key, TTL and data loader;
   * serialization and cache lookup are handled here.
   */
  async remember<T>({ key, ttlSeconds = 300, loader }: CacheOptions<T>): Promise<T> {
    const cached = await this.getValue<T>(key);
    if (cached !== null) return cached;

    const value = await loader();
    await this.setValue(key, value, ttlSeconds);
    return value;
  }

  /** Deletes a logical cache group without exposing Redis implementation details. */
  async forget(key: string): Promise<void> {
    await this.deleteKey(key);
  }

  async deleteKey(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async deleteByPattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  /**
   * Get value from Redis hash
   * @param hashKey - The hash key
   * @param field - The field within the hash
   * @returns The value or null if not found
   */
  async getHashValue<T = any>(hashKey: string, field: string): Promise<T | null> {
    const data = await this.redis.hget(hashKey, field);
    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T;
    }
  }

  /**
   * Set value in Redis hash with optional TTL
   * @param hashKey - The hash key
   * @param field - The field within the hash
   * @param value - The value to set
   * @param ttlSeconds - Optional TTL in seconds
   */
  async setHashValue<T = any>(
    hashKey: string,
    field: string,
    value: T,
    ttlSeconds?: number,
  ): Promise<void> {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    await this.redis.hset(hashKey, field, serialized);

    if (ttlSeconds) {
      await this.redis.expire(hashKey, ttlSeconds);
    }
  }

  async acquireLock(key: string, value: string, ttlSeconds: number) {
    const result = await this.redis.set(key, value, 'EX', ttlSeconds, 'NX');
    return !!result;
  }

  async releaseLock(key: string, lockValue: string) {
    const luaScript = `
      if redis.call("GET", KEYS[1]) == ARGV[1]
      then
        return redis.call("DEL", KEYS[1])
      else
        return 0
      end
    `;
    await this.redis.eval(luaScript, 1, key, lockValue);
  }

  public getResetPasswordKey(userId: string): string {
    return `user:${userId}:reset_password`;
  }

  public getVerifyEmailKey(userId: string): string {
    return `user:${userId}:verify`;
  }

  public getUserTokenKey(userId: string, jti: string): string {
    return `user:${userId}:token:${jti}`;
  }

  public getUserTokenPattern(userId: string): string {
    return `user:${userId}:token:*`;
  }

  public getUserTwoFactorOtpKey(userId: string): string {
    return `user:${userId}:2fa:otp`;
  }

  public getCalendarSyncLockKey(
    provider: 'google' | 'zoom' | 'outlook',
    practitionerId: number,
  ) {
    return `${provider}_calendar_sync_lock:${practitionerId}`;
  }

  public getResetPasswordAttempts(email: string) {
    return `user:${email}:reset_password_attempts`;
  }

  async increaseResetAttempts(email: string, ttlSeconds: number): Promise<number> {
    const key = this.getResetPasswordAttempts(email);
    const count = await this.redis.incr(key);
    if (count === 1) {
      await this.redis.expire(key, ttlSeconds);
    }
    return count;
  }

  async getResetAttemptsTtl(email: string): Promise<number> {
    return this.redis.ttl(this.getResetPasswordAttempts(email));
  }
}
