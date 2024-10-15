import log from '../../utils/logger';
import { refreshDiscordToken } from '../../utils/refresh';
import { getDiscordToken } from './discord.query';

const axios = require('axios');

async function getDiscordLastServerName(email: any): Promise<any> {
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

        const servers = response.data;

        if (servers.length > 0) {
            const lastServer = servers[servers.length - 1];
            return lastServer.name;
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Failed to fetch joined servers : ${error}`);
        await refreshDiscordToken(email, token.tRefreshToken);
        return null;
    }
}

async function getDiscordUsername(email: any): Promise<any> {
    const token = await getDiscordToken(email);
    try {
        const response = await axios.get(
            `https://discord.com/api/v10/users/@me`,
            {
                headers: {
                    Authorization: `Bearer ${token.dAccessToken}`,
                },
            }
        );

        return response.data.global_name;
    } catch (error) {
        console.error(`Failed to fetch Discord username : ${error}`);
        await refreshDiscordToken(email, token.tRefreshToken);
        return null;
    }
}
