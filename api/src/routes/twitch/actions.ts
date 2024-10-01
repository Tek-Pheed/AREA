import { getUserId, getUserLogin } from "./twitch";

const axios = require('axios');
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;

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

export async function getStreamerStatus(token: string, username: string): Promise<any> {
    try {
        const userLogin = await getUserLogin(token, username);

        if (!userLogin) {
            console.error('Invalid username.');
            return null;
        }

        const response = await axios.get(
            'https://api.twitch.tv/helix/streams',
            {
                headers: {
                    'Client-ID': TWITCH_CLIENT_ID,
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    user_login: userLogin,
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
        console.error(`Error fetching streamer status : ${error}`);
        return null;
    }
}
