import { getSpotifyToken } from './spotify.query';
import log from '../../utils/logger';
import { refreshSpotifyToken } from '../../utils/refresh';
const axios = require('axios');

export async function getSongURL(
    name: string,
    access_token: string,
    refresh_token: string,
    email: string
): Promise<any> {
    try {
        const response = await axios.get(
            `https://api.spotify.com/v1/search?q=${name}&type=track`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );
        if (!response.data) {
            return false;
        }
        return response.data.tracks.items[0].external_urls.spotify;
    } catch (e) {
        log.error(e);
        await refreshSpotifyToken(email, refresh_token);
        return false;
    }
}

export async function isPlaying(email: string): Promise<any> {
    const { sAccessToken, sRefreshToken } = await getSpotifyToken(email);
    if (!sAccessToken || !sRefreshToken) {
        return false;
    }
    try {
        const response = await axios.get(
            'https://api.spotify.com/v1/me/player',
            {
                headers: {
                    Authorization: `Bearer ${sAccessToken}`,
                },
            }
        );
        if (!response.data) {
            return false;
        }
        return [
            {
                name: 'artistsName',
                value: response.data.item.artists[0].name,
            },
            {
                name: 'songName',
                value: response.data.item.name,
            },
        ];
    } catch (e) {
        log.error(e);
        await refreshSpotifyToken(email, sRefreshToken);
        return false;
    }
}

export async function getSpecificSong(
    email: string,
    target_song: string
): Promise<any> {
    const { sAccessToken, sRefreshToken } = await getSpotifyToken(email);
    if (!sAccessToken || !sRefreshToken) {
        return false;
    }
    const song_url = await getSongURL(
        target_song,
        sAccessToken,
        sRefreshToken,
        email
    );
    try {
        if (!song_url) {
            return false;
        }
        const response = await axios.get(
            'https://api.spotify.com/v1/me/player/currently-playing',
            {
                headers: {
                    Authorization: `Bearer ${sAccessToken}`,
                },
            }
        );
        if (!response.data) {
            return false;
        }
        if (response.data.item.external_urls.spotify.includes(song_url)) {
            return [
                {
                    name: 'artistsName',
                    value: response.data.item.artists[0].name,
                },
                {
                    name: 'songName',
                    value: response.data.item.name,
                },
            ];
        } else return false;
    } catch (e) {
        log.error(e);
        await refreshSpotifyToken(email, sRefreshToken);
        return false;
    }
}
