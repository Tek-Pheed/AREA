import { getSpotifyToken } from './spotify.query';
const axios = require('axios');

export async function getSongURL(
    name: string,
    access_token: string
): Promise<any> {
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
}

export async function getCurrentSong(
    email: string,
    target_song: string
): Promise<any> {
    const { sAccessToken, sRefreshToken } = await getSpotifyToken(email);
    const song_url = await getSongURL(target_song, sAccessToken);
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
        return {
            deviceName: response.data.device.name,
            repeatState: response.data.repeat_state,
            artistsName: response.data.item.artists.name,
            itemName: response.data.item.name,
        };
    } else return false;
}
