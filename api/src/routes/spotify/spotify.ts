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
];

export const spotifyRouter = Router();

/*export async function getCurrentSong(token: string): Promise<any> {
    const response = await axios.get(
        'https://api.spotify.com/v1/me/player/currently-playing',
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.data) {
        return null;
    }
    return response.data.item.name || null;
}*/

export async function refreshSpotifyToken(
    refreshToken: string
): Promise<string> {
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
        throw new Error('Missing Spotify Client ID or Client Secret');
    }

    const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: SPOTIFY_CLIENT_ID,
            client_secret: SPOTIFY_CLIENT_SECRET,
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
    '/login/mobile/ios',
    passport.authenticate('spotify', {
        state: JSON.stringify({ platform: 'ios' }),
    }),
    async (req: Request, res: Response) => {
        //#swagger.tags = ['Spotify OAuth']
    }
);

spotifyRouter.get(
    '/login/mobile/android',
    passport.authenticate('spotify', {
        state: JSON.stringify({ platform: 'android' }),
    }),
    async (req: Request, res: Response) => {
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
        res.redirect(
            `http://localhost:8081/dashboard/profile?api=twitch&refresh_token=${req.user.refreshTokenSpotify}&access_token=${req.user.accessTokenSpotify}`
        );
    }
);
