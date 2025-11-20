import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;
let redis: Redis | null = null;

if (redisUrl) {
  redis = new Redis(redisUrl);
}

const memoryCache = new Map<string, { value: any; expiresAt: number }>();

export async function setCache(key: string, value: any, ttlSeconds = 300) {
  if (redis) {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    return;
  }
  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

export async function getCache<T = any>(key: string): Promise<T | null> {
  if (redis) {
    const raw = await redis.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    memoryCache.delete(key);
    return null;
  }
  return entry.value as T;
}
