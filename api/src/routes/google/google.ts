import { Request, Response, NextFunction, Express, Router } from 'express';
import { isAuthenticatedGoogle } from '../../middlewares/oauth';
import qs from 'qs';

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
        res.redirect(
            `http://localhost:8081/dashboard/profile?api=google&refresh_token=${req.user.refreshTokenGoogle}&access_token=${req.user.accessTokenGoogle}`
        );
        //res.redirect('http://localhost:8080/api/oauth/google/getCalendars');
        // #swagger.tags   = ['Google OAuth']
    }
);
