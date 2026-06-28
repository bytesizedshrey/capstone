import { configDotenv } from "dotenv";
import app from './src/app.js'
import { connectRabbitMQ } from './src/mq.js'

// Load environment variables if not loaded by Docker/K8s
configDotenv();

app.listen(4000, async () => {
    console.log('Notification Service is running on port 4000');
    
    // Initialize RabbitMQ Consumer
    await connectRabbitMQ();
});
