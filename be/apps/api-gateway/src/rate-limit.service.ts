import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class GatewayRateLimitService implements OnModuleDestroy {
  private readonly redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
    connectTimeout: 500,
    maxRetriesPerRequest: 1,
    retryStrategy: () => null,
  });

  constructor() {
    // Rate limiting must fail open if Redis is temporarily unavailable.
    this.redis.on('error', () => undefined);
  }

  async consume(key: string, limit: number, windowSeconds: number) {
    try {
      const count = await this.redis.incr(key);
      if (count === 1) await this.redis.expire(key, windowSeconds);
      const retryAfterSeconds = Math.max(await this.redis.ttl(key), 0);
      return { allowed: count <= limit, retryAfterSeconds };
    } catch {
      return { allowed: true, retryAfterSeconds: 0 };
    }
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
