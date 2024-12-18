import {
    refreshAccessTokeninDB,
    refreshAccessTokeninDBDiscord,
} from './refresh.query';
import log from './logger';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

const axios = require('axios');

export async function refreshSpotifyToken(
    email: string,
    refreshToken: string
): Promise<any> {
    try {
        if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
            throw new Error('Missing Spotify Client ID or Client Secret');
        }

        if (refreshToken === null || refreshToken === undefined) {
            log.warn(`Spotify refresh token for ${email} is null`);
            return false;
        }

        const response = await axios.post(
            `https://accounts.spotify.com/api/token?grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${SPOTIFY_CLIENT_ID}&client_secret=${SPOTIFY_CLIENT_SECRET}`,
            {},
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        if (response.data.access_token) {
            await refreshAccessTokeninDB(
                email,
                'spotify',
                response.data.access_token
            );
            return true;
        }
        return false;
    } catch (e) {
        log.error(e);
        return false;
    }
}

export async function refreshDiscordToken(
    email: string,
    refreshToken: string
): Promise<any> {
    if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET) {
        throw new Error('Missing Discord Client ID or Client Secret');
    }

    if (refreshToken === null || refreshToken === undefined) {
        log.warn(`Discord refresh token for ${email} is null`);
        return false;
    }

    try {
        const qs = require('qs');
        let data = qs.stringify({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: DISCORD_CLIENT_ID,
            client_secret: DISCORD_CLIENT_SECRET,
        });

        const response = await axios.post(
            'https://discord.com/api/v10/oauth2/token',
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            },
            data
        );
        if (response.data.access_token) {
            await refreshAccessTokeninDBDiscord(
                email,
                'discord',
                response.data.access_token,
                response.data.refresh_token
            );
            return true;
        }
    } catch (e) {
        log.error(e);
        return false;
    }
}

export async function refreshTwitchToken(
    email: string,
    refreshToken: string
): Promise<any> {
    if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET) {
        throw new Error('Missing Twitch Client ID or Client Secret');
    }

    if (refreshToken === null || refreshToken === undefined) {
        log.warn(`Twitch refresh token for ${email} is null`);
        return false;
    }

    try {
        const response = await axios.post(
            'https://id.twitch.tv/oauth2/token',
            new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: TWITCH_CLIENT_ID,
                client_secret: TWITCH_CLIENT_SECRET,
            }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        if (response.data.access_token) {
            await refreshAccessTokeninDB(
                email,
                'twitch',
                response.data.access_token
            );
            return true;
        }
    } catch (e) {
        log.error(e);
        return false;
    }
}
