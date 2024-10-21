import { Response, Request, Router } from 'express';
import log from '../../utils/logger';

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

twitchRouter.get('/login', function (req: Request, res: Response) {
    //#swagger.tags   = ['Twitch OAuth']
    const origin = req.headers.origin || req.protocol + '://' + req.get('host');
    const state = Buffer.from(JSON.stringify({ origin })).toString('base64');

    log.info(`Origin: ${req.headers['user-agent']}`);
    log.info(`State: ${state}`);

    passport.authenticate('twitch', {
        scope: TWITCH_OAUTH_SCOPE,
        state: {
            state,
        }, // Passer le state encodé
    })(req, res);
});

twitchRouter.get(
    '/callback',
    passport.authenticate('twitch', {
        failureRedirect: '/api/oauth/twitch/login',
    }),
    async (req: Request, res: Response) => {
        const token: any = req.user;
        const origin = req.headers['user-agent'];

        if (origin?.toLowerCase().includes('android')) {
            log.warn(
                `http://localhost/dashboard/profile?api=twitch&refresh_token=${token.refreshTokenTwitch}&access_token=${token.accessTokenTwitch}`
            );
            res.redirect(
                `http://localhost/dashboard/profile?api=twitch&refresh_token=${token.refreshTokenTwitch}&access_token=${token.accessTokenTwitch}`
            );
        } else if (origin?.toLowerCase().includes('iphone')) {
            log.warn(
                `capacitor://localhost/dashboard/profile?api=twitch&refresh_token=${token.refreshTokenTwitch}&access_token=${token.accessTokenTwitch}`
            );
            res.redirect(
                `capacitor://localhost/dashboard/profile?api=twitch&refresh_token=${token.refreshTokenTwitch}&access_token=${token.accessTokenTwitch}`
            );
        } else {
            log.warn(
                `${process.env.WEB_HOST}/dashboard/profile?api=twitch&refresh_token=${token.refreshTokenTwitch}&access_token=${token.accessTokenTwitch}`
            );
            res.redirect(
                `${process.env.WEB_HOST}/dashboard/profile?api=twitch&refresh_token=${token.refreshTokenTwitch}&access_token=${token.accessTokenTwitch}`
            );
        }
        //#swagger.tags   = ['Twitch OAuth']
    }
);
