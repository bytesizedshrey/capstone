import { Router } from "express";
import User from "../models/user.model.js";
import passport from "passport";
import { sendAuthNotification } from "../config/mq.js";
import jwt from "jsonwebtoken";

const router = Router();


router.get('/google', passport.authenticate('google', {
    session: false,
    scope: [ 'profile', 'email' ]
}));

router.get('/google/callback', passport.authenticate('google', {
    session: false,
    failureRedirect: '/'
}), async (req, res) => {
    try {
        const { id, displayName, emails, photos } = req.user;
        let user = await User.findOne({ googleId: id });
        
        if (!user) {
            user = new User({
                googleId: id,
                email: emails[ 0 ].value,
                name: displayName,
                avatar: photos[ 0 ].value
            });
            await user.save();
        }

        await sendAuthNotification({
            userId: user._id,
            action: 'google_login',
            timestamp: new Date(),
            email: emails[ 0 ].value
        })

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
        const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || 'localhost';

        const cookieOptions = {
            httpOnly: true,           // JS can't read it — XSS protection
            maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
        };

        // If deploying to production, we need secure & sameSite=none for cross-domain cookies
        if (COOKIE_DOMAIN !== 'localhost') {
            cookieOptions.secure = true;
            cookieOptions.sameSite = 'none';
            cookieOptions.domain = COOKIE_DOMAIN;
        }

        // Set token in cookie
        res.cookie('token', token, cookieOptions);
        res.redirect(`${FRONTEND_URL}?login=success`); // Redirect to your frontend after successful login
    } catch (err) {
        console.error('Error during Google authentication:', err);
        res.redirect('/'); // Redirect to your frontend on error
    }
});

router.get('/logout', (req, res) => {
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
    const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || 'localhost';
    const cookieOptions = { httpOnly: true };
    if (COOKIE_DOMAIN !== 'localhost') {
        cookieOptions.secure = true;
        cookieOptions.sameSite = 'none';
        cookieOptions.domain = COOKIE_DOMAIN;
    }
    res.clearCookie('token', cookieOptions);
    res.redirect(`${FRONTEND_URL}?logout=success`);
});


export default router;