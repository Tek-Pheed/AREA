import axios from 'axios';
import { Request, Response, NextFunction, Express } from 'express';
import * as querystring from 'querystring';

// Environment variables for Twitch
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const TWITCH_REDIRECT_URI = process.env.TWITCH_REDIRECT_URI;
const TWITCH_OAUTH_SCOPE = 'user:read:email';

// Function to get OAuth token from Twitch
async function getOAuthToken(code: string): Promise<string> {
    const response = await axios.post(
        'https://id.twitch.tv/oauth2/token',
        null,
        {
            params: {
                client_id: TWITCH_CLIENT_ID,
                client_secret: TWITCH_CLIENT_SECRET,
                code,
                grant_type: 'authorization_code',
                redirect_uri: TWITCH_REDIRECT_URI,
            },
        }
    );
    return response.data.access_token;
}

async function getUserInfo(token: string) {
    const response = await axios.get('https://api.twitch.tv/helix/users', {
        headers: {
            'Client-ID': TWITCH_CLIENT_ID,
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.data[0];
}

export async function isUserLive(
    userName: string,
    token: string
): Promise<boolean> {
    const response = await axios.get('https://api.twitch.tv/helix/streams', {
        headers: {
            'Client-ID': TWITCH_CLIENT_ID,
            Authorization: `Bearer ${token}`,
        },
        params: {
            user_login: userName,
        },
    });
    return response.data.data.length > 0;
}

export function redirectToTwitch(req: Request, res: Response) {
    const twitchAuthUrl = `https://id.twitch.tv/oauth2/authorize?${querystring.stringify(
        {
            client_id: TWITCH_CLIENT_ID,
            redirect_uri: TWITCH_REDIRECT_URI,
            response_type: 'code',
            scope: TWITCH_OAUTH_SCOPE,
        }
    )}`;
    res.redirect(twitchAuthUrl);
}

// Handle the Twitch callback
export async function handleTwitchCallback(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { code } = req.query;
    if (!code || typeof code !== 'string') {
        return res.status(400).send('Invalid code');
    }

    try {
        const token = await getOAuthToken(code);
        const userInfo = await getUserInfo(token);

        // Store token and user info in session
        req.session.twitchToken = token;
        req.session.userInfo = userInfo;

        res.redirect('/api/check-kamet0-live');
    } catch (error) {
        next(error);
    }
    return;
}

// Middleware to ensure user is authenticated
export function ensureAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.session || !req.session.twitchToken) {
        return res.redirect('/auth/twitch');
    }
    next();
}

module.exports = (app: Express) => {
    app.get('/auth/twitch', redirectToTwitch);
    app.get('/auth/twitch/callback', handleTwitchCallback);

    app.get('/api/check-kamet0-live', ensureAuthenticated, async (req, res) => {
        try {
            const token = req.session?.twitchToken;
            if (!token) {
                return res.status(500).send('No token found');
            }
            const live = await isUserLive('Kamet0', token);
            return res.json({ live });
        } catch (error) {
            return res.status(500).send('Error checking live status');
        }
    });
};
