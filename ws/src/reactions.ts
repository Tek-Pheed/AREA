import { getSpotifyToken } from './spotify.query';

const axios = require('axios');

export async function getUserSpotifyID(token: string): Promise<string> {
    const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.data) {
        return '';
    }
    return response.data.id;
}

export async function getSongID(
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
    return response.data.tracks.items[0].id;
}

export async function startPlaybackSong(
    email: string,
    track: string
): Promise<boolean> {
    const { sAccessToken, sRefreshToken } = await getSpotifyToken(email);
    const song_id = await getSongID(track, sAccessToken);
    console.log(song_id);
    if (!song_id) {
        return false;
    }
    const response = await axios.put(
        'https://api.spotify.com/v1/me/player/play',
        { uris: [`spotify:track:${song_id}`] },
        {
            headers: {
                Authorization: `Bearer ${sAccessToken}`,
            },
        }
    );
    if (response.status === 204) {
        return true;
    } else return false;
}

export async function skipToNextSong(email: string): Promise<boolean> {
    const { sAccessToken, sRefreshToken } = await getSpotifyToken(email);
    const response = await axios.post(
        'https://api.spotify.com/v1/me/player/next',
        {},
        {
            headers: {
                Authorization: `Bearer ${sAccessToken}`,
            },
        }
    );
    if (response.status === 204) {
        return true;
    } else return false;
}

export async function skipToPreviousSong(email: string): Promise<boolean> {
    const { sAccessToken, sRefreshToken } = await getSpotifyToken(email);
    const response = await axios.post(
        'https://api.spotify.com/v1/me/player/previous',
        {},
        {
            headers: {
                Authorization: `Bearer ${sAccessToken}`,
            },
        }
    );
    if (response.status === 204) {
        return true;
    } else return false;
}

export async function setPlaybackVolume(
    email: string,
    volumePercent: string
): Promise<boolean> {
    const { sAccessToken, sRefreshToken } = await getSpotifyToken(email);
    const response = await axios.put(
        `https://api.spotify.com/v1/me/player/volume?volume_percent=${volumePercent}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${sAccessToken}`,
            },
        }
    );
    if (response.status === 204) {
        return true;
    } else return false;
}

export async function createPlaylist(
    email: string,
    playlistName: string,
    playlistDescription: string,
    isPublic: boolean
): Promise<boolean> {
    const { sAccessToken, sRefreshToken } = await getSpotifyToken(email);
    const userId = await getUserSpotifyID(sAccessToken);
    if (!userId) {
        return false;
    }
    const response = await axios.post(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
            name: playlistName,
        },
        {
            headers: {
                Authorization: `Bearer ${sAccessToken}`,
                'Content-Type': 'application/json',
            },
            body: {
                description: playlistDescription,
                public: isPublic,
            },
        }
    );
    if (response.status === 201) {
        return true;
    } else return false;
}

export async function addItemsToPlaylist(
    email: string,
    playlist_id: string,
    track_uris: string[]
): Promise<boolean> {
    const { sAccessToken, sRefreshToken } = await getSpotifyToken(email);
    const response = await axios.post(
        `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
        {
            uris: track_uris,
        },
        {
            headers: {
                Authorization: `Bearer ${sAccessToken}`,
                'Content-Type': 'application/json',
            },
            body: {
                uris: track_uris,
                position: 0,
            },
        }
    );
    if (response.status === 201) {
        return true;
    } else return false;
}
