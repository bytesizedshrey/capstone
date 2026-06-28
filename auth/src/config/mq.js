import amqplib from 'amqplib';

const QUEUE = 'auth_notification_queue';
let channel = null;
let connection = null;

async function connectRabbitMQ() {
    try {
        if (!process.env.RABBITMQ_URL) {
            console.warn('[Auth MQ] Warning: RABBITMQ_URL is not set. RabbitMQ connection will be skipped.');
            return;
        }

        connection = await amqplib.connect(process.env.RABBITMQ_URL);
        
        connection.on('error', (err) => {
            console.error('[Auth MQ] Connection error:', err);
            setTimeout(connectRabbitMQ, 5000);
        });

        connection.on('close', () => {
            console.warn('[Auth MQ] Connection closed, reconnecting...');
            setTimeout(connectRabbitMQ, 5000);
        });

        console.log('[Auth MQ] Successfully connected to RabbitMQ');

        channel = await connection.createChannel();
        console.log('[Auth MQ] Channel created successfully');

        await channel.assertQueue(QUEUE, { durable: true });
        console.log(`[Auth MQ] Queue "${QUEUE}" asserted successfully`);

    } catch (error) {
        console.error('[Auth MQ] Failed to connect to RabbitMQ:', error);
        // Retry connection after 5 seconds
        setTimeout(connectRabbitMQ, 5000);
    }
}

// Initialize connection asynchronously without blocking the main event loop
connectRabbitMQ();

export async function sendAuthNotification(message) {
    if (!channel) {
        console.error('[Auth MQ] Cannot publish message: RabbitMQ channel is not initialized');
        return;
    }

    try {
        const payload = Buffer.from(JSON.stringify(message));
        channel.sendToQueue(
            QUEUE,
            payload,
            { persistent: true }
        );
        console.log('[Auth MQ] Message published successfully:', message);
    } catch (error) {
        console.error('[Auth MQ] Failed to publish message:', error);
    }
}