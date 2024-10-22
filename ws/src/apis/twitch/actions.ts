import log from '../../utils/logger';
import { refreshTwitchToken } from '../../utils/refresh';
import { getTwitchToken } from './twitch.query';

const axios = require('axios');
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;

export async function getUserId(token: any, email: string): Promise<any> {
    try {
        const response = await axios.get('https://api.twitch.tv/helix/users/', {
            headers: {
                'Client-Id': TWITCH_CLIENT_ID,
                Authorization: `Bearer ${token.tAccessToken}`,
            },
        });
        if (response.data && response.data.data.length > 0) {
            return response.data.data[0].id;
        }
    } catch (error) {
        log.error(`Error : ${error}`);
        await refreshTwitchToken(email, token.tRefreshToken);
        return null;
    }
}

export async function getBroadcasterIdFromUsername(
    token: any,
    username: string,
    email: string
): Promise<string | null> {
    try {
        const response = await axios.get('https://api.twitch.tv/helix/users', {
            headers: {
                'Client-Id': TWITCH_CLIENT_ID,
                Authorization: `Bearer ${token.tAccessToken}`,
            },
            params: {
                login: username,
            },
        });

        if (response.data && response.data.data.length > 0) {
            const userData = response.data.data[0];
            const broadcasterId = userData.id;
            return broadcasterId;
        } else {
            log.error(`No user found for username : ${username}`);
            return null;
        }
    } catch (error) {
        log.error(`Error : ${error}`);
        await refreshTwitchToken(email, token.tRefreshToken);
        return null;
    }
}

export async function getUserLogin(
    token: string,
    username: string
): Promise<any> {
    const response = await axios.get('https://api.twitch.tv/helix/users', {
        headers: {
            'Client-Id': TWITCH_CLIENT_ID,
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
    /*const id = await getUserId(token);

    if (!id) {
        return null;
    }

    const response = await axios.get(
        `https://api.twitch.tv/helix/streams/followed?user_id=${id}`,
        {
            headers: {
                'Client-Id': TWITCH_CLIENT_ID,
                Authorization: `Bearer ${token}`,
            },
        }
    );
    if (!response.data) {
        return null;
    }
    return response.data || null;*/
}

export async function getStreamerStatus(
    email: string,
    username: string
): Promise<any> {
    const token = await getTwitchToken(email);
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
            return [
                {
                    name: 'game_name',
                    value: streamData.game_name,
                },
                {
                    name: 'title',
                    value: streamData.title,
                },
                {
                    name: 'viewer_count',
                    value: streamData.viewer_count,
                },
            ];
        } else {
            return false;
        }
    } catch (e: any) {
        log.error(`email:${email} service:Twitch getStreamerStatus ${e}`);
        await refreshTwitchToken(email, token.tRefreshToken);
        return false;
    }
}

async function getChannelInfo(email: string, username: string): Promise<any> {
    const token = await getTwitchToken(email);
    const broadcasterId = await getBroadcasterIdFromUsername(
        token,
        username,
        email
    );
    try {
        const response = await axios.get(
            `https://api.twitch.tv/helix/channels?broadcaster_id=${broadcasterId}`,
            {
                headers: {
                    Authorization: `Bearer ${token.tAccessToken}`,
                    'Client-Id': TWITCH_CLIENT_ID,
                },
            }
        );

        if (response.data && response.data.data.length > 0) {
            const streamData = response.data.data[0];
            return [
                {
                    name: 'game_name',
                    value: streamData.game_name,
                },
                {
                    name: 'title',
                    value: streamData.title,
                },
            ];
        } else {
            return false;
        }
    } catch (e: any) {
        log.error(`email:${email} service:Twitch getChannelInfo ${e}`);
        await refreshTwitchToken(email, token.tRefreshToken);
        return false;
    }
}

export async function getCurrentGame(
    email: any,
    username: string,
    gameName: string
): Promise<any> {
    const channelInfo = await getChannelInfo(email, username);

    if (channelInfo) {
        const game_name = channelInfo[0].value;

        if (game_name == gameName)
            return [
                {
                    name: 'game_name',
                    value: game_name,
                },
                {
                    name: 'broadcaster_name',
                    value: username,
                },
            ];
        else return false;
    } else {
        return false;
    }
}

export async function getCurrentTitle(
    email: any,
    username: string,
    titleName: string
): Promise<any> {
    const channelInfo = await getChannelInfo(email, username);

    if (channelInfo) {
        const title = channelInfo[1].value;

        if (titleName == title)
            return [
                {
                    name: 'title',
                    value: title,
                },
                {
                    name: 'broadcaster_name',
                    value: username,
                },
            ];
        else return false;
    } else {
        return false;
    }
}

export async function getTopGame(email: any): Promise<any> {
    const token = await getTwitchToken(email);
    try {
        const response = await axios.get(
            'https://api.twitch.tv/helix/games/top',
            {
                headers: {
                    Authorization: `Bearer ${token.tAccessToken}`,
                    'Client-Id': TWITCH_CLIENT_ID,
                },
                params: {
                    first: 100,
                },
            }
        );

        if (response.data && response.data.data.length > 0) {
            const games = response.data.data;

            const gameCount: Record<string, number> = {};

            for (const game of games) {
                const gameName = game.name;
                if (gameCount[gameName]) {
                    gameCount[gameName]++;
                } else {
                    gameCount[gameName] = 1;
                }
            }

            let mostPlayedGameName = '';
            let maxCount = 0;

            for (const [name, count] of Object.entries(gameCount)) {
                if (count > maxCount) {
                    maxCount = count;
                    mostPlayedGameName = name;
                }
            }

            return [
                {
                    name: 'most_played_game',
                    value: mostPlayedGameName,
                },
            ];
        } else {
            return false;
        }
    } catch (e: any) {
        log.error(`email:${email} service:Twitch getTopGame ${e}`);
        await refreshTwitchToken(email, token.tRefreshToken);
        return false;
    }
}
