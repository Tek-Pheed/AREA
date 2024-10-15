import { Response, Router } from 'express';

const OAuth2Strategy = require('passport-oauth2').Strategy;
const axios = require('axios');
const passport: any = require('passport');

const UNSPLASH_CLIENT_ID = process.env.UNSPLASH_CLIENT_ID;
const UNSPLASH_CLIENT_SECRET = process.env.UNSPLASH_CLIENT_SECRET;
const UNSPLASH_REDIRECT_URI = process.env.UNSPLASH_REDIRECT_URI;

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
    passport.authenticate('unsplash'),
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
        res.redirect(
            `http://localhost:8081/dashboard/profile?api=unsplash&refresh_token=${req.user.refreshTokenUnsplash}&access_token=${req.user.accessTokenUnsplash}`
        );
        //res.redirect('http://localhost:8080/api/oauth/unsplash/get_random_img');
        //#swagger.tags   = ['Unsplash OAuth']
    }
);
