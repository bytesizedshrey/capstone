// Message queue stub — replace with real AMQP client when RabbitMQ is available
export async function sendAuthNotification(payload) {
    console.log('[mq] Auth notification (stub):', JSON.stringify(payload));
}
