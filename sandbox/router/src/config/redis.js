import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;

let redis = null;

// connection is a bit unstable no cap
try {
  redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    connectTimeout: 2000,
    retryStrategy: () => null // Fail fast if Redis is not running
  });

  redis.on('error', (err) => {
    // Fail silently so the app does not crash when Redis is offline
    console.warn(`[Redis] Connection warning (running in degraded mode): ${err.message}`);
  });
} catch (error) {
  console.warn(`[Redis] Initialization warning (running in degraded mode): ${error.message}`);
}

// keeping it rent free in cache
export async function refreshTTL(sandboxId) {
  if (!redis) return;
  try {
    const key = `sandbox:${sandboxId}`;
    // Refresh the sandbox TTL to 20 minutes (1200 seconds)
    await redis.expire(key, 1200);
  } catch (err) {
    console.warn(`[Redis] Failed to refresh TTL for ${sandboxId}: ${err.message}`);
  }
}
