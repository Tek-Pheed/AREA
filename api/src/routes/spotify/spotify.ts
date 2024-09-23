import { Request, Response, NextFunction, Express } from 'express';
import { isAuthenticatedSpotify } from '../../middlewares/oauth';
const axios = require('axios');
const session = require('express-session');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const SpotifyStrategy = require('passport-spotify').Strategy;

const SPOTIFY_SCOPES = ['user-read-currently-playing'];

export async function getCurrentSong(token: string): Promise<any> {
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
}

async function refreshSpotifyToken(refreshToken: string): Promise<string> {
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

module.exports = (app: Express, passport: any) => {
    app.use(
        session({
            secret: 'your_secret_key', // Set a secure key here
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
                accessToken: string,
                refreshToken: string,
                expires_in: any,
                profile: any,
                done: any
            ) {
                const user = { profile, accessToken, refreshToken };
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
    app.get('/auth/spotify', passport.authenticate('spotify'));

    app.get(
        '/auth/spotify/callback',
        passport.authenticate('spotify', { failureRedirect: '/auth/spotify' }),
        function (req: any, res: Response) {
            // User is authenticated at this point
            res.redirect('/api/get_current_song');
        }
    );

    app.get(
        '/api/get_current_song',
        isAuthenticatedSpotify,
        async (req: any, res: Response) => {
            try {
                let accessToken = req.user.accessToken;
                const refreshToken = req.user.refreshToken;
                let live = await getCurrentSong(accessToken);

                if (!live && refreshToken) {
                    accessToken = await refreshSpotifyToken(refreshToken);
                    req.user.accessToken = accessToken;
                    live = await getCurrentSong(accessToken);
                }

                return res.json({ live });
            } catch (error) {
                console.error('Error fetching current song', error);
                return res.status(500).send('Error checking live status');
            }
        }
    );
};
