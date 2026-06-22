import Redis from 'ioredis';

const redisHost = process.env.REDIS_HOST || 'redis-service';
const redisPort = process.env.REDIS_PORT || 6379;

let redis = null;

// connection is a bit unstable no cap
try {
  redis = new Redis({
    host: redisHost,
    port: parseInt(redisPort, 10),
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
    // Refresh the sandbox TTL to 30 minutes (1800 seconds)
    await redis.expire(key, 1800);
  } catch (err) {
    console.warn(`[Redis] Failed to refresh TTL for ${sandboxId}: ${err.message}`);
  }
}
