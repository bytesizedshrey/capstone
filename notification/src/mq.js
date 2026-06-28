import amqplib from 'amqplib';
import { sendEmail } from './email.js';

const QUEUE = 'auth_notification_queue';
let channel = null;
let connection = null;

export async function connectRabbitMQ() {
    try {
        if (!process.env.RABBITMQ_URL) {
            console.warn('[Notification MQ] Warning: RABBITMQ_URL is not set. RabbitMQ connection will be skipped.');
            return;
        }

        connection = await amqplib.connect(process.env.RABBITMQ_URL);

        connection.on('error', (err) => {
            console.error('[Notification MQ] Connection error:', err);
            setTimeout(connectRabbitMQ, 5000);
        });

        connection.on('close', () => {
            console.warn('[Notification MQ] Connection closed, reconnecting...');
            setTimeout(connectRabbitMQ, 5000);
        });

        console.log('[Notification MQ] Successfully connected to RabbitMQ');

        channel = await connection.createChannel();
        console.log('[Notification MQ] Channel created successfully');

        await channel.assertQueue(QUEUE, { durable: true });
        console.log(`[Notification MQ] Queue "${QUEUE}" asserted successfully`);

        // Start consuming messages
        channel.consume(QUEUE, async (msg) => {
            if (msg !== null) {
                try {
                    const messageContent = JSON.parse(msg.content.toString());
                    console.log('[Notification MQ] Received message:', messageContent);

                    // Determine the email subject and body based on the action
                    let subject = 'Notification from CryBoy';
                    let text = `Action occurred: ${messageContent.action}`;
                    let html = `<p>Action occurred: <b>${messageContent.action}</b></p>`;

                    if (messageContent.action === 'google_login') {
                        subject = 'New Login Alert';
                        text = 'We detected a new login to your CryBoy account via Google.';
                        html = '<p>We detected a new login to your <b>CryBoy</b> account via Google.</p>';
                    }

                    // Call the sendEmail function
                    if (messageContent.email) {
                        await sendEmail(messageContent.email, subject, text, html);
                        console.log(`[Notification MQ] Email sent successfully to ${messageContent.email}`);
                    } else {
                        console.warn('[Notification MQ] Message did not contain an email address to notify.');
                    }

                    // Acknowledge the message so it is removed from the queue
                    channel.ack(msg);
                } catch (err) {
                    console.error('[Notification MQ] Error processing message:', err);
                    // Do not requeue by default to avoid poison pill loops, unless necessary
                    channel.nack(msg, false, false);
                }
            }
        });

        console.log(`[Notification MQ] Waiting for messages in "${QUEUE}"...`);

    } catch (error) {
        console.error('[Notification MQ] Failed to connect to RabbitMQ:', error);
        setTimeout(connectRabbitMQ, 5000);
    }
}
