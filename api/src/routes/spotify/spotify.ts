import { Request, Response, NextFunction, Express, Router } from 'express';
import { isAuthenticatedSpotify } from '../../middlewares/oauth';
import { insertTokeninDb } from '../oauth/oauth.query';
import { getCurrentSong } from './actions';
import { auth } from '../../middlewares/auth';

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
        //const email = req.params.email;
        //res.cookie('email', email);
        /*
                #swagger.responses[200] = {
                    description: "Some description...",
                    content: {
                        "application/json": {
                            schema:{
                                $ref: "#/components/schemas/actions"
                            }
                        }
                    }
                }
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

spotifyRouter.get('/callback', (req: any, res: Response, next: any) => {
    passport.authenticate('spotify', (err: any, user: any, info: any) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/api/oauth/spotify/login'); // Redirection en cas d'échec
        }

        const state = req.query.state
            ? JSON.parse(req.query.state as string)
            : {};
        const platform = state.platform || 'unknown';

        if (platform === 'ios') {
            return res.redirect(
                `capacitor://localhost/tabs/profile?api=spotify&refresh_token=${user.refreshTokenSpotify}&access_token=${user.accessTokenSpotify}`
            );
        } else if (platform === 'android') {
            return res.redirect(
                `http://localhost/tabs/profile?api=spotify&refresh_token=${user.refreshTokenSpotify}&access_token=${user.accessTokenSpotify}`
            );
        } else {
            return res.redirect(
                `http://localhost:8081/dashboard/profile?api=spotify&refresh_token=${user.refreshTokenSpotify}&access_token=${user.accessTokenSpotify}`
            );
        }
    })(req, res, next);
});
