import { Request, Response, NextFunction, Express } from 'express';
import { Passport } from 'passport';

const OAuth2Strategy = require('passport-oauth2').Strategy;
const axios = require('axios');

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const TWITCH_REDIRECT_URI = process.env.TWITCH_REDIRECT_URI;
const TWITCH_OAUTH_SCOPE = 'user:read:email';

export async function isUserLive(
    userName: string,
    token: string
): Promise<boolean> {
    const response = await axios.get('https://api.twitch.tv/helix/streams', {
        headers: {
            'Client-ID': TWITCH_CLIENT_ID,
            Authorization: `Bearer ${token}`,
        },
        params: {
            user_login: userName,
        },
    });
    return response.data.data.length > 0;
}

module.exports = (app: Express, passport: any) => {
    passport.use(
        'twitch',
        new OAuth2Strategy(
            {
                authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
                tokenURL: 'https://id.twitch.tv/oauth2/token',
                clientID: TWITCH_CLIENT_ID,
                clientSecret: TWITCH_CLIENT_SECRET,
                callbackURL: TWITCH_REDIRECT_URI,
                scope: TWITCH_OAUTH_SCOPE,
            },
            function (
                accessToken: string,
                refreshToken: string,
                profile: any,
                done: any
            ) {
                done(null, { accessToken });
            }
        )
    );

    passport.serializeUser((user: any, done: any) => {
        done(null, user);
    });

    passport.deserializeUser((user: any, done: any) => {
        done(null, user);
    });

    app.get('/auth/twitch', passport.authenticate('twitch'));

    app.get(
        '/auth/twitch/callback',
        passport.authenticate('twitch'),
        (req: any, res: Response) => {
            req.session.twitchToken = req.user.accessToken;
        }
    );

    app.get('/api/check-kamet0-live', async (req: any, res: Response) => {
        console.log('token ' + req.session.twitchToken);
        if (!req.session.twitchToken) {
            return res.redirect('/auth/twitch');
        }
        try {
            const token = req.session.twitchToken;
            const live = await isUserLive('Kamet0', token);
            return res.json({ live });
        } catch (error) {
            return res.status(500).send('Error checking live status');
        }
    });
};
