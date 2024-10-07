import { Response, Router } from 'express';

const OAuth2Strategy = require('passport-oauth2').Strategy;
const axios = require('axios');
const session = require('express-session');
const passport: any = require('passport');

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const TWITCH_REDIRECT_URI = process.env.TWITCH_REDIRECT_URI;
const TWITCH_OAUTH_SCOPE = ['user:read:follows', 'user:write:chat'];

export const twitchRouter = Router();

export async function getUserId(token: string): Promise<any> {
    const response = await axios.get('https://api.twitch.tv/helix/users/', {
        headers: {
            'Client-ID': TWITCH_CLIENT_ID,
            Authorization: `Bearer ${token}`,
        },
    });
    if (response.data && response.data.data.length > 0) {
        return response.data.data[0].id;
    } else {
        return null;
    }
}

export async function getUserLogin(
    token: string,
    username: string
): Promise<any> {
    const response = await axios.get('https://api.twitch.tv/helix/users', {
        headers: {
            'Client-ID': TWITCH_CLIENT_ID,
            Authorization: `Bearer ${token}`,
        },
        params: {
            login: username,
        },
    });

    if (response.data && response.data.data.length > 0) {
        return response.data.data[0].login;
    } else {
        return null;
    }
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
    '/login',
    passport.authenticate('twitch', { scope: TWITCH_OAUTH_SCOPE }),
    function (req, res) {
        //#swagger.tags   = ['Twitch OAuth']
    }
);

twitchRouter.get(
    '/callback',
    passport.authenticate('twitch', {
        failureRedirect: '/api/oauth/twitch/login',
    }),
    async (req: any, res: Response) => {
        res.redirect(
            `http://localhost:8081/profile?api=twitch&refresh_token=${req.user.refreshTokenTwitch}&access_token=${req.user.accessTokenTwitch}`
        );
        //#swagger.tags   = ['Twitch OAuth']
    }
);
