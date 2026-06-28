import express from 'express';
import morgan from 'morgan';
import { sendEmail } from './email.js';
import channel from './mq.js';

const app = express();
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Hello from Notification Service!');
});

app.get("/_status/healthz", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.get("/_status/readyz", (req, res) => {
    res.status(200).json({ status: "ready" });
});

channel.consume('auth_notification_queue', async (msg) => {
    if (msg !== null) {
        const messageContent = msg.content.toString();
        console.log('Received message from queue:', messageContent);

        try {
            const { userId, timestamp, email, action } = JSON.parse(messageContent);
            
            let subject = 'New Login Notification';
            let text = `A new login was detected for your account at ${timestamp}. If this was not you, please secure your account immediately.`;
            let html = `<p>A new login was detected for your account at <strong>${timestamp}</strong>. If this was not you, please secure your account immediately.</p>`;

            if (action === 'google_login') {
                subject = 'New Login Alert';
                text = 'We detected a new login to your CryBoy account via Google.';
                html = '<p>We detected a new login to your <b>CryBoy</b> account via Google.</p>';
            }

            await sendEmail(email, subject, text, html);
            
            channel.ack(msg);
        } catch (error) {
            console.error('Error processing message:', error);
            channel.nack(msg, false, false);
        }
    } else {
        console.log('Received null message');
    }
});

export default app;