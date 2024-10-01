import { getSpotifyToken } from './spotify.query';
const axios = require('axios');

export async function getCurrentSong(
    email: string,
    target_song: string
): Promise<boolean> {
    const { sAccessToken, sRefreshToken } = await getSpotifyToken(email);
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
    if (response.data.item.external_urls.spotify.includes(target_song)) {
        return true;
    } else return false;
}
