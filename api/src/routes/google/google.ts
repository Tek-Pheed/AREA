import { Request, Response, NextFunction, Express, Router } from 'express';
import { isAuthenticatedGoogle } from '../../middlewares/oauth';
import qs from 'qs';
import { discordRouter } from '../discord/discord';
import { insertTokeninDb } from '../oauth/oauth.query';

const axios = require('axios');
const session = require('express-session');
const passport: any = require('passport');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
var GoogleStrategy = require('passport-google-oauth20');

export const googleRouter = Router();

passport.use(
    'google',
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: GOOGLE_REDIRECT_URI,
            scope: [
                'https://www.googleapis.com/auth/calendar',
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
            ],
            state: true,
        },
        function verify(
            accessTokenGoogle: string,
            refreshTokenGoogle: string,
            profileGoogle: any,
            cb: any
        ) {
            const user = {
                profileGoogle,
                accessTokenGoogle,
                refreshTokenGoogle,
            };
            cb(null, user);
        }
    )
);

passport.serializeUser((user: any, done: any) => {
    done(null, user);
});

passport.deserializeUser((obj: any, done: any) => {
    done(null, obj);
});

googleRouter.get(
    '/login',
    passport.authenticate('google', { accessType: 'offline' }),
    function (req, res) {
        //#swagger.tags   = ['Google OAuth']
    }
);

googleRouter.get(
    '/login/:email',
    (req: any, res: Response, next: NextFunction) => {
        const email = req.params.email;
        passport.authenticate('google', {
            accessType: 'offline',
            state: email,
        })(req, res, next);
    },
    async (req: any, res: Response) => {
        //#swagger.tags = ['Google OAuth']
    }
);

googleRouter.use(
    session({
        secret: process.env.SESSION_SECRET || 'default_secret',
        resave: false,
        saveUninitialized: true,
    })
);

googleRouter.get(
    '/callback',
    passport.authenticate('google', {
        failureRedirect: '/api/oauth/google/login',
    }),
    async (req: any, res: Response) => {
        const token: any = req.user;
        const email = req.query.state;
        await insertTokeninDb(
            'google',
            token.accessTokenGoogle,
            token.refreshTokenGoogle,
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
        // #swagger.tags   = ['Google OAuth']
    }
);
