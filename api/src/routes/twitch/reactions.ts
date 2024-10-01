import { getTwitchToken } from './twitch.query';

const axios = require('axios');
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;

export async function createClip(email: string, broadcasterId: string): Promise<any> {
    const sAccessToken = await getTwitchToken(email);
    try {
        const response = await axios.post(
            `https://api.twitch.tv/helix/clips?broadcaster_id=${broadcasterId}`,
            null,
            {
                headers: {
                    'Client-ID': TWITCH_CLIENT_ID,
                    Authorization: `Bearer ${sAccessToken}`,
                },
            }
        );

        if (response.status === 202) {
            const clipData = response.data.data[0];
            return clipData;
        } else {
            console.error(`Failed to create clip. Status code: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.error(`Error creating clip : ${error}`);
        return null;
    }
}
