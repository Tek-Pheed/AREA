import log from '../../utils/logger';
import { refreshDiscordToken } from '../../utils/refresh';
import { getDiscordToken } from './discord.query';

const axios = require('axios');

async function getJoinedServers(email: any): Promise<any> {
    const token = await getDiscordToken(email);
    try {
        const response = await axios.get(
            `https://discord.com/api/v10/users/@me/guilds`,
            {
                headers: {
                    Authorization: `Bearer ${token.dAccessToken}`,
                },
            }
        );

        const messages = response.data.map((message: any) => ({
            content: message.content,
            author: message.author.username,
        }));

        return messages;
    } catch (error) {
        console.error(`Failed to fetch messages: ${error}`);
        await refreshDiscordToken(email, token.tRefreshToken);
        return null;
    }
}
