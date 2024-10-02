import log from '../../utils/logger';

const axios = require('axios');
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;

export async function getUserId(token: string): Promise<any> {
    const response = await axios.get('https://api.twitch.tv/helix/users/', {
        headers: {
            'Client-ID': TWITCH_CLIENT_ID,
            Authorization: `Bearer ${token}`,
        },
    });
    if (response.data && response.data.data.length > 0) {
        return response.data.data[0].id;
    } else {
        return null;
    }
}

export async function getUserLogin(
    token: string,
    username: string
): Promise<any> {
    const response = await axios.get('https://api.twitch.tv/helix/users', {
        headers: {
            'Client-ID': TWITCH_CLIENT_ID,
            Authorization: `Bearer ${token}`,
        },
        params: {
            login: username,
        },
    });

    if (response.data && response.data.data.length > 0) {
        return response.data.data[0].login;
    } else {
        return null;
    }
}

export async function getFollowedStreams(token: string): Promise<any> {
    const id = await getUserId(token);

    if (!id) {
        return null;
    }

    const response = await axios.get(
        `https://api.twitch.tv/helix/streams/followed?user_id=${id}`,
        {
            headers: {
                'Client-ID': TWITCH_CLIENT_ID,
                Authorization: `Bearer ${token}`,
            },
        }
    );
    if (!response.data) {
        return null;
    }
    return response.data || null;
}

export async function getStreamerStatus(
    token: any,
    username: string
): Promise<any> {
    try {
        const response = await axios.get(
            `https://api.twitch.tv/helix/streams?user_login=${username}`,
            {
                headers: {
                    Authorization: `Bearer ${token.tAccessToken}`,
                    'Client-Id': TWITCH_CLIENT_ID,
                },
            }
        );

        if (response.data && response.data.data.length > 0) {
            const streamData = response.data.data[0];
            return {
                streamDetails: {
                    game_name: streamData.game_name,
                    title: streamData.title,
                    viewer_count: streamData.viewer_count,
                },
            };
        } else {
            return {
                streamDetails: [],
            };
        }
    } catch (error) {
        log.error(`Error fetching streamer status : ${error}`);
        return null;
    }
}
