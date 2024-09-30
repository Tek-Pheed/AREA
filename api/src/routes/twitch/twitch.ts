import { Response, Express, Router } from 'express';
import { isAuthenticatedTwitch } from '../../middlewares/oauth';
import { insertTokeninDb } from '../oauth/oauth.query';

const OAuth2Strategy = require('passport-oauth2').Strategy;
const axios = require('axios');
const session = require('express-session');
const passport: any = require('passport');

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const TWITCH_REDIRECT_URI = process.env.TWITCH_REDIRECT_URI;
const TWITCH_OAUTH_SCOPE = 'user:read:follows';

export const twitchRouter = Router();

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

async function refreshTwitchToken(refreshToken: string): Promise<string> {
    if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET) {
        throw new Error('Missing Twitch Client ID or Client Secret');
    }

    const response = await axios.post(
        'https://id.twitch.tv/oauth2/token',
        new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: TWITCH_CLIENT_ID,
            client_secret: TWITCH_CLIENT_SECRET,
        }).toString(),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    );

    const newAccessToken = response.data.access_token;
    return newAccessToken;
}

twitchRouter.use(
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

twitchRouter.get(
    '/login/:email',
    passport.authenticate('twitch', { scope: TWITCH_OAUTH_SCOPE }),
    function (req, res) {
        //const email = req.params.email;
        //res.cookie('email', email);
        /*
                #swagger.responses[200] = {
                    description: "Some description...",
                    content: {
                        "application/json": {
                            schema:{
                                $ref: "#/components/schemas/actions"
                            }
                        }
                    }
                }
                #swagger.tags   = ['Twitch OAuth']
            */
    }
);

twitchRouter.get(
    '/callback',
    passport.authenticate('twitch', {
        failureRedirect: '/api/oauth/twitch/login',
    }),
    async (req: any, res: Response) => {
        const email = req.cookies.email;
        const accessTokenTwitch = req.user.accessTokenTwitch;
        const refreshTokenTwitch = req.user.refreshTokenTwitch;
        await insertTokeninDb(
            'twitch',
            accessTokenTwitch,
            refreshTokenTwitch,
            email
        );
        res.redirect('http://localhost:4200/profile');
        /*
                #swagger.responses[200] = {
                    description: "Some description...",
                    content: {
                        "application/json": {
                            schema:{
                                $ref: "#/components/schemas/actions"
                            }
                        }
                    }
                }
                #swagger.tags   = ['Twitch OAuth']
            */
    }
);

twitchRouter.get(
    '/get_followings',
    isAuthenticatedTwitch,
    async (req: any, res: Response) => {
        if (!req.user || !req.user.accessTokenTwitch) {
            return res.redirect('/api/oauth/twitch/login');
        }
        /*
                #swagger.responses[200] = {
                    description: "Some description...",
                    content: {
                        "application/json": {
                            schema:{
                                $ref: "#/components/schemas/actions"
                            }
                        }
                    }
                }
                #swagger.tags   = ['Twitch OAuth']
            */

        try {
            let accessToken = req.user.accessTokenTwitch;
            const refreshToken = req.user.refreshTokenTwitch;
            let followed = await getFollowedStreams(accessToken);

            if (!followed && refreshToken) {
                accessToken = await refreshTwitchToken(refreshToken);
                req.user.accessTokenTwitch = accessToken;
                followed = await getFollowedStreams(accessToken);
            }
            return res.json({ followed });
        } catch (error) {
            console.error('Error getting followed streams', error);
            return res.status(500).send('Error getting followed streams');
        }
    }
);
