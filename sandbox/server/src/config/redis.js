import Redis from 'ioredis'
import { deletePod } from '../kubernetes/pod.js'
import { deleteService } from '../kubernetes/service.js'

const redis = new Redis(process.env.REDIS_URL)
redis.on('error', (err) => {
    console.error('[Redis Client] Error:', err.message);
});

const subscriber = new Redis(process.env.REDIS_URL)
subscriber.on('error', (err) => {
    console.error('[Redis Subscriber] Error:', err.message);
});

export async function createSandboxKey(sandboxId) {
    try {
        await redis.set(`sandbox:${sandboxId}`, JSON.stringify({
            status: 'active'
        }), "EX", 1200)
    } catch (err) {
        console.error('[Redis Client] Failed to set sandbox key:', err.message);
    }
}

subscriber.on('connect', async () => {
    try {
        await subscriber.config('SET', 'notify-keyspace-events', 'Ex')
        await subscriber.subscribe('__keyevent@0__:expired')
        console.log('[Redis Subscriber] Subscribed to expired keyevents successfully');
    } catch (err) {
        console.error('[Redis Subscriber] Failed to setup subscriptions:', err.message);
    }
});

subscriber.on('message', async (channel, key) => {
    console.log(`Key Expired : ${key}`)

    const sandboxId = key.split(':')[1]

    try {
        await deletePod(sandboxId)
        await deleteService(sandboxId)
    } catch (err) {
        console.error('[Redis Subscriber] Error handling expired key cleanup:', err.message);
    }
})

export default { subscriber }