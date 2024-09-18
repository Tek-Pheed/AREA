import { Request, Response, NextFunction, Express } from 'express';
const axios = require('axios');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

//var state = generateRandomString(16);
//var scope = 'user-read-private user-read-email';
const SpotifyStrategy = require('passport-spotify').Strategy;

export async function getCurrentSong(token: string): Promise<boolean> {
    const response = await axios.get(
        'https://api.spotify.com/v1/me/player/currently-playing',
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    console.log(response);
    return response.data.data.length > 0;
}

module.exports = (app: Express, passport: any) => {
    passport.use(
        'spotify',
        new SpotifyStrategy(
            {
                clientID: SPOTIFY_CLIENT_ID,
                clientSecret: SPOTIFY_CLIENT_SECRET,
                callbackURL: SPOTIFY_REDIRECT_URI,
            },
            function (
                accessToken: string,
                refreshToken: string,
                expires_in: any,
                profile: string,
                done: any
            ) {
                console.log(accessToken);
                done(null, { accessToken });
            }
        )
    );

    passport.serializeUser((user: any, done: any) => {
        done(null, user);
    });

    passport.deserializeUser((user: any, done: any) => {
        done(null, user);
    });

    app.get('/auth/spotify', passport.authenticate('spotify'));

    app.get(
        '/auth/spotify/callback',
        passport.authenticate('spotify'),
        (req: any, res: Response) => {
            req.session.spotifyToken = req.user.accessToken;
        }
    );

    app.get(
        '/api/get_current_song',
        passport.authenticate('spotify'),
        async (req: any, res: Response) => {
            //if (!req.session.spotifyToken) {
            //    return res.redirect('/auth/spotify');
            //}
            try {
                const token = req.session.spotifyToken;
                //const live = await getCurrentSong(token);
                console.log('done');
                //return res.json({ live });
                return res.json('done');
            } catch (error) {
                return res.status(500).send('Error checking live status');
            }
        }
    );
};
