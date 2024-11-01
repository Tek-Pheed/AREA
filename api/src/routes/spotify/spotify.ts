import { NextFunction, Request, Response, Router } from 'express';
import log from '../../utils/logger';
import API from '../../middlewares/api';
import { insertTokeninDb } from '../oauth/oauth.query';

const axios = require('axios');
const session = require('express-session');
const passport: any = require('passport');

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const SpotifyStrategy = require('passport-spotify').Strategy;

const SPOTIFY_SCOPES = [
    'user-read-currently-playing',
    'user-modify-playback-state',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-read-playback-state',
];

export const spotifyRouter = Router();

spotifyRouter.use(
    session({
        secret: process.env.SESSION_SECRET || 'default_secret',
        resave: false,
        saveUninitialized: true,
    })
);

passport.use(
    'spotify',
    new SpotifyStrategy(
        {
            clientID: SPOTIFY_CLIENT_ID,
            clientSecret: SPOTIFY_CLIENT_SECRET,
            callbackURL: SPOTIFY_REDIRECT_URI,
            scope: SPOTIFY_SCOPES,
        },
        function (
            accessTokenSpotify: string,
            refreshTokenSpotify: string,
            expires_in: any,
            profileSpotify: any,
            done: any
        ) {
            const user = {
                profileSpotify,
                accessTokenSpotify,
                refreshTokenSpotify,
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

// Spotify authentication routes
spotifyRouter.get(
    '/login',
    passport.authenticate('spotify'),
    function (req, res) {
        //#swagger.tags = ['Spotify OAuth']
    }
);

spotifyRouter.get(
    '/login/:email',
    (req: any, res: Response, next: NextFunction) => {
        const email = req.params.email;
        passport.authenticate('spotify', { state: email })(req, res, next);
    },
    async (req: any, res: Response) => {
        //#swagger.tags = ['Spotify OAuth']
    }
);

spotifyRouter.get(
    '/callback',
    passport.authenticate('spotify', {
        failureRedirect: '/api/oauth/spotify/login',
    }),
    async (req: any, res: Response) => {
        //#swagger.tags = ['Spotify OAuth']
        const token: any = req.user;
        const email = req.query.state;
        await insertTokeninDb(
            'spotify',
            token.accessTokenSpotify,
            token.refreshTokenSpotify,
            `${email}`
        );
        const origin = req.headers['user-agent'];
        if (
            origin.toLowerCase().includes('android') ||
            origin.toLowerCase().includes('iphone')
        ) {
            res.send(
                '<body><h1>Your are login to spotify, you can close this modal !</h1><script>window.close()</script></body>'
            );
        } else {
            res.redirect(`${process.env.WEB_HOST}/dashboard/profile`);
        }
    }
);
