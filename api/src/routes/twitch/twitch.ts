import { Response, Request, Router, NextFunction } from 'express';
import { insertTokeninDb } from '../oauth/oauth.query';
import { spotifyRouter } from '../spotify/spotify';

const OAuth2Strategy = require('passport-oauth2').Strategy;
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
    passport.authenticate('twitch', {
        scope: TWITCH_OAUTH_SCOPE,
    }),
    function (req, res) {
        /*
                #swagger.tags   = ['Twitch OAuth']
            */
    }
);

twitchRouter.get(
    '/login/:email',
    (req: any, res: Response, next: NextFunction) => {
        const email = req.params.email;
        passport.authenticate('twitch', {
            scope: TWITCH_OAUTH_SCOPE,
            state: email,
        })(req, res, next);
    },
    async (req: any, res: Response) => {
        //#swagger.tags = ['Twitch OAuth']
    }
);

twitchRouter.get(
    '/callback',
    passport.authenticate('twitch', {
        failureRedirect: '/api/oauth/twitch/login',
    }),
    async (req: any, res: Response) => {
        const token: any = req.user;
        const email = req.query.state;
        await insertTokeninDb(
            'twitch',
            token.accessTokenTwitch,
            token.refreshTokenTwitch,
            `${email}`
        );
        const origin = req.headers['user-agent'];
        if (
            origin.toLowerCase().includes('android') ||
            origin.toLowerCase().includes('iphone')
        ) {
            res.send('You are connected close this modal !');
        } else {
            res.redirect(`${process.env.WEB_HOST}/dashboard/profile`);
        }
        //#swagger.tags   = ['Twitch OAuth']
    }
);
