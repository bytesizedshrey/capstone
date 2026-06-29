import "dotenv/config";
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import cookies from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(morgan('dev'));
app.use(cookies());
app.use(passport.initialize());
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        /^https?:\/\/(?:.+\.)?localhost(?::\d+)?$/,  // allow all localhost origins
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

const CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:8090/api/auth/google/callback';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

app.set('trust proxy', 1);

app.get("/_status/healthz", (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.get("/_status/readyz", (req, res) => {
    res.status(200).json({ status: 'ready' });
});

app.use('/api/auth', authRoutes);

export default app;