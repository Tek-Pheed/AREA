import { Response, Router } from 'express';

const OAuth2Strategy = require('passport-oauth2').Strategy;
const axios = require('axios');
const session = require('express-session');
const passport: any = require('passport');

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const TWITCH_REDIRECT_URI = process.env.TWITCH_REDIRECT_URI;
const TWITCH_OAUTH_SCOPE = [
    'user:read:follows',
    'user:write:chat',
    'clips:edit',
];

export const twitchRouter = Router();

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
            `http://localhost:8081/dashboard/profile?api=twitch&refresh_token=${req.user.refreshTokenTwitch}&access_token=${req.user.accessTokenTwitch}`
        );
        //#swagger.tags   = ['Twitch OAuth']
    }
);
