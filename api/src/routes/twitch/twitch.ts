import { Request, Response, NextFunction, Express } from 'express';
import { Passport } from 'passport';
import { isAuthenticatedTwitch } from '../../middlewares/oauth';

const OAuth2Strategy = require('passport-oauth2').Strategy;
const axios = require('axios');
const session = require('express-session');

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const TWITCH_REDIRECT_URI = process.env.TWITCH_REDIRECT_URI;
const TWITCH_OAUTH_SCOPE = 'user:read:follows';

export async function getUserId(token: string): Promise<string> {
    const resp = await axios.get('https://api.twitch.tv/helix/users/', {
        headers: {
            'Client-ID': TWITCH_CLIENT_ID,
            Authorization: `Bearer ${token}`,
        },
    });
    return resp.data.data[0].id || null;
}

export async function getFollowedStreams(token: string): Promise<any> {
    const id = await getUserId(token);
    if (id === null) return null;
    const response = await axios.get(
        `https://api.twitch.tv/helix/streams/followed?user_id=${id}`,
        {
            headers: {
                'Client-ID': TWITCH_CLIENT_ID,
                Authorization: `Bearer ${token}`,
            },
        }
    );
    if (!response.data) {
        return null;
    }
    return response.data || null;
}

module.exports = (app: Express, passport: any) => {
    app.use(
        session({
            secret: process.env.SESSION_SECRET || 'default_secret',
            resave: false,
            saveUninitialized: true,
        })
    );

    passport.use(
        'twitch',
        new OAuth2Strategy(
            {
                authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
                tokenURL: 'https://id.twitch.tv/oauth2/token',
                clientID: TWITCH_CLIENT_ID,
                clientSecret: TWITCH_CLIENT_SECRET,
                callbackURL: TWITCH_REDIRECT_URI,
                state: true,
                scope: TWITCH_OAUTH_SCOPE,
            },
            function (
                accessTokenTwitch: string,
                refreshTokenTwitch: string,
                profileTwitch: any,
                done: any
            ) {
                const user = {
                    profileTwitch,
                    accessTokenTwitch,
                    refreshTokenTwitch,
                };
                done(null, user);
            }
        )
    );

    passport.serializeUser((user: any, done: any) => {
        done(null, user);
    });

    passport.deserializeUser((obj: any, done: any) => {
        done(null, obj);
    });

    app.get(
        '/auth/twitch',
        passport.authenticate('twitch', { scope: TWITCH_OAUTH_SCOPE })
    );

    app.get(
        '/auth/twitch/callback',
        passport.authenticate('twitch', { failureRedirect: '/auth/twitch' }),
        (req: any, res: Response) => {
            res.redirect('/api/get_followings');
        }
    );

    app.get(
        '/api/get_followings',
        isAuthenticatedTwitch,
        async (req: any, res: Response) => {
            if (!req.user || !req.user.accessTokenTwitch) {
                return res.redirect('/auth/twitch');
            }

            try {
                const token = req.user.accessTokenTwitch;
                const live = await getFollowedStreams(token);
                return res.json({ live });
            } catch (error) {
                console.error('Error getting followed streams', error);
                return res.status(500).send('Error getting followed streams');
            }
        }
    );
};
