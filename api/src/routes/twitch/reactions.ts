import { getUserId } from './twitch';
import { getTwitchToken } from './twitch.query';

const axios = require('axios');
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;

export async function getBroadcasterId(token: string, username: string): Promise<any> {
    try {
        const resp = await axios.get(`https://api.twitch.tv/helix/users?login=${username}`, {
            headers: {
                'Client-ID': TWITCH_CLIENT_ID,
                Authorization: `Bearer ${token}`,
            },
        });

        if (resp.data.data && resp.data.data.length > 0) {
            return resp.data.data[0].id;
        } else {
            console.error(`Broadcaster not found for username : ${username}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching broadcaster ID for username : ${username}`, error);
        return null;
    }
}

export async function createClip(email: string, broadcasterUsername: string): Promise<any> {
    try {
        const { tAccessToken, tRefreshToken } = await getTwitchToken(email);
        const broadcasterId = await getBroadcasterId(tAccessToken, broadcasterUsername);

        if (!broadcasterId) {
            return null;
        }

        const response = await axios.post(
            `https://api.twitch.tv/helix/clips?broadcaster_id=${broadcasterId}`,
            null,
            {
                headers: {
                    'Client-ID': TWITCH_CLIENT_ID,
                    Authorization: `Bearer ${tAccessToken}`,
                },
            }
        );

        if (response.status === 202) {
            const clipData = response.data.data[0];
            return clipData;
        } else {
            console.error(`Failed to create clip. Status code : ${response.status}`);
            return null;
        }
    } catch (error) {
        console.error(`Error creating clip : ${error}`);
        return null;
    }
}

export async function sendChatMessage(email: string, broadcasterUsername: string, message: string): Promise<any> {
    try {
        const { tAccessToken, tRefreshToken } = await getTwitchToken(email);
        const broadcasterId = await getBroadcasterId(tAccessToken, broadcasterUsername);
        const senderId = await getUserId(tAccessToken);

        if (!broadcasterId || !senderId) {
            return null;
        }

        const response = await axios.post(
            'https://api.twitch.tv/helix/chat/messages',
            {
                broadcaster_id: broadcasterId,
                sender_id: senderId,
                message: message
            },
            {
                headers: {
                    Authorization: `Bearer ${tAccessToken}`,
                    'Client-ID': TWITCH_CLIENT_ID,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.status === 200) {
            const responseData = response.data.data[0];
            return responseData;
        } else {
            console.error(`Failed to send message. Status code : ${response.status}`);
            return null;
        }
    } catch (error) {
        console.error(`Error sending chat message : ${error}`);
        return null;
    }
}
