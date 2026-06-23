import express from 'express';
import morgan from 'morgan';

const app = express();

// setting up middleware fr
app.use(morgan('dev'));
app.use(express.json());

// checking if server is home no cap
app.get('/api/ai/healthz', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

export default app;