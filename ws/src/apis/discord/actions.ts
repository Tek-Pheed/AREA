import { refreshDiscordToken } from '../../utils/refresh';
import { getDiscordToken } from './discord.query';
import { createVariable, readValue, setItem } from '../../utils/storage';

const axios = require('axios');

export async function getDiscordLastServerName(email: any): Promise<any> {
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

        await createVariable(`${email}-discord`);

        if (response.data) {
            const serverList: number[] = [];
            let newServer: any = null;
            const servers = response.data;
            const serverStorage: number[] = (
                await readValue(`${email}-discord`)
            )['allServers'];

            if (serverStorage) {
                for (const server of servers) {
                    serverList.push(server.id);
                    if (!serverStorage.includes(server.id)) {
                        newServer = server;
                    }
                }
            } else {
                for (const server of servers) {
                    serverList.push(server.id);
                }
            }
            await setItem(`${email}-discord`, 'allServers', serverList);
            if (newServer == null) {
                return false;
            } else {
                return [
                    {
                        name: 'serverName',
                        value: newServer.name,
                    },
                ];
            }
        } else {
            return false;
        }
    } catch (error) {
        console.error(`Failed to fetch joined servers : ${error}`);
        await refreshDiscordToken(email, token.dRefreshToken);
        return false;
    }
}

export async function getDiscordUsername(email: any): Promise<any> {
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

        if (response.data) {
            return [
                {
                    name: 'username',
                    value: response.data.global_name,
                },
            ];
        } else {
            return false;
        }
    } catch (error) {
        console.error(`Failed to fetch Discord username : ${error}`);
        await refreshDiscordToken(email, token.dRefreshToken);
        return false;
    }
}
