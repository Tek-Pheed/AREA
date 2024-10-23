import { getTwitchToken } from './twitch.query';
import { getUserId } from './actions';
import log from '../../utils/logger';
import { refreshTwitchToken } from '../../utils/refresh';

const axios = require('axios');
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;

export async function getBroadcasterId(
    token: string,
    username: string,
    refresh_token: string,
    email: string
): Promise<any> {
    try {
        const resp = await axios.get(
            `https://api.twitch.tv/helix/users?login=${username}`,
            {
                headers: {
                    'Client-Id': TWITCH_CLIENT_ID,
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (resp.data.data && resp.data.data.length > 0) {
            return resp.data.data[0].id;
        } else {
            log.error(`Broadcaster not found for username : ${username}`);
            return null;
        }
    } catch (error) {
        log.error(
            `Error fetching broadcaster ID for username : ${username}`,
            error
        );
        await refreshTwitchToken(email, refresh_token);
        return null;
    }
}

export async function createClip(
    email: string,
    broadcasterUsername: string
): Promise<any> {
    const { tAccessToken, tRefreshToken } = await getTwitchToken(email);
    try {
        const broadcasterId = await getBroadcasterId(
            tAccessToken,
            broadcasterUsername,
            tRefreshToken,
            email
        );

        if (!broadcasterId) {
            return null;
        }

        const response = await axios.post(
            `https://api.twitch.tv/helix/clips?broadcaster_id=${broadcasterId}`,
            null,
            {
                headers: {
                    'Client-Id': TWITCH_CLIENT_ID,
                    Authorization: `Bearer ${tAccessToken}`,
                },
            }
        );

        if (response.status === 202) {
            return true;
        } else {
            log.error(
                `email:${email} service:Twitch Failed to create clip. Status code : ${response.status}`
            );
            return false;
        }
    } catch (error) {
        log.error(`Error creating clip : ${error}`);
        await refreshTwitchToken(email, tRefreshToken);
        return false;
    }
}

export async function sendChatMessage(
    email: string,
    broadcasterUsername: string,
    message: string
): Promise<any> {
    const { tAccessToken, tRefreshToken } = await getTwitchToken(email);
    try {
        const broadcasterId = await getBroadcasterId(
            tAccessToken,
            broadcasterUsername,
            tRefreshToken,
            email
        );
        const senderId = await getUserId(
            { tAccessToken, tRefreshToken },
            email
        );

        if (!broadcasterId || !senderId) {
            return null;
        }

        const response = await axios.post(
            'https://api.twitch.tv/helix/chat/messages',
            {
                broadcaster_id: broadcasterId,
                sender_id: senderId,
                message: message,
            },
            {
                headers: {
                    Authorization: `Bearer ${tAccessToken}`,
                    'Client-Id': TWITCH_CLIENT_ID,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.status === 200) {
            return true;
        } else {
            log.error(
                `Failed to send message. Status code : ${response.status}`
            );
            return false;
        }
    } catch (error) {
        log.error(`Error sending chat message : ${error}`);
        log.info(tRefreshToken);
        await refreshTwitchToken(email, tRefreshToken);
        return false;
    }
}
