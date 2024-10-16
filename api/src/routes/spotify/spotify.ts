import { Request, Response, Router } from 'express';

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
        /*
                #swagger.tags   = ['Spotify OAuth']
            */
    }
);

spotifyRouter.get(
    '/callback',
    passport.authenticate('spotify', {
        failureRedirect: '/api/oauth/spotify/login',
    }),
    async (req: any, res: Response) => {
        //#swagger.tags = ['Spotify OAuth']
        res.redirect(
            `http://localhost:8081/dashboard/profile?api=spotify&refresh_token=${req.user.refreshTokenSpotify}&access_token=${req.user.accessTokenSpotify}`
        );
    }
);
