import { Response, Router } from 'express';
import { insertTokeninDb } from '../oauth/oauth.query';

const OAuth2Strategy = require('passport-oauth2').Strategy;
const axios = require('axios');
const passport: any = require('passport');

const UNSPLASH_CLIENT_ID = process.env.UNSPLASH_CLIENT_ID;
const UNSPLASH_CLIENT_SECRET = process.env.UNSPLASH_CLIENT_SECRET;
const UNSPLASH_REDIRECT_URI = process.env.UNSPLASH_REDIRECT_URI;
const UNSPLASH_SCOPE = [
    'public',
    'read_user',
    'write_user',
    'read_photos',
    'write_photos',
    'write_likes',
    'write_followers',
    'read_collections',
    'write_collections',
];

export const unsplashRouter = Router();

passport.use(
    'unsplash',
    new OAuth2Strategy(
        {
            authorizationURL: 'https://unsplash.com/oauth/authorize',
            tokenURL: 'https://unsplash.com/oauth/token ',
            clientID: UNSPLASH_CLIENT_ID,
            clientSecret: UNSPLASH_CLIENT_SECRET,
            callbackURL: UNSPLASH_REDIRECT_URI,
            scope: UNSPLASH_SCOPE,
            scope_separator: '+',
            response_type: 'code',
        },
        function (
            accessTokenUnsplash: string,
            refreshTokenUnsplash: string,
            profileUnsplash: any,
            done: any
        ) {
            const user = {
                profileUnsplash,
                accessTokenUnsplash,
                refreshTokenUnsplash,
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

unsplashRouter.get(
    '/login',
    passport.authenticate('unsplash', { scope: UNSPLASH_SCOPE }),
    function (req, res) {
        //#swagger.tags   = ['Unsplash OAuth']
    }
);

unsplashRouter.get(
    '/callback',
    passport.authenticate('unsplash', {
        failureRedirect: '/api/oauth/unsplash/login',
    }),
    async (req: any, res: Response) => {
        const token: any = req.user;
        const email = req.query.state;
        console.log(email);
        const origin = req.headers['user-agent'];
        if (
            origin?.toLowerCase().includes('android') ||
            origin?.toLowerCase().includes('iphone')
        ) {
            await insertTokeninDb(
                'unsplash',
                token.accessTokenUnsplash,
                token.refreshTokenUnsplash,
                `${email}`
            );
            res.send('You are connected close this modal !');
        } else {
            res.redirect(
                `${process.env.WEB_HOST}/dashboard/profile?api=unsplash&refresh_token=${req.user.refreshTokenUnsplash}&access_token=${req.user.accessTokenUnsplash}`
            );
        }
        //res.redirect('http://localhost:8080/api/oauth/unsplash/get_random_img');
        //#swagger.tags   = ['Unsplash OAuth']
    }
);
