import { db } from '../../database/db';

export async function getAllActions(): Promise<any> {
    try {
        const result = await db.promise().query('SELECT * FROM actions');
        if (result.length > 0) {
            return result[0];
        } else {
            return null;
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function getActionsAPI(): Promise<any> {
    try {
        const result = await db.promise().query('SELECT * FROM actions_api');
        if (result.length > 0) {
            return result[0];
        } else {
            return null;
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function getStatusConnection(email: string): Promise<any> {
    try {
        const result = await db.promise().query(`SELECT
    email,
    CASE WHEN githubAccessToken IS NOT NULL AND githubAccessToken != '' THEN TRUE ELSE FALSE
END AS github,
CASE WHEN twitchAccessToken IS NOT NULL AND twitchAccessToken != '' THEN TRUE ELSE FALSE
END AS twitch,
CASE WHEN spotifyAccessToken IS NOT NULL AND spotifyAccessToken != '' THEN TRUE ELSE FALSE
END AS spotify,
CASE WHEN discordAccessToken IS NOT NULL AND discordAccessToken != '' THEN TRUE ELSE FALSE
END AS discord,
CASE WHEN coinbaseAccessToken IS NOT NULL AND coinbaseAccessToken != '' THEN TRUE ELSE FALSE
END AS coinbase,
CASE WHEN googleAccessToken IS NOT NULL AND googleAccessToken != '' THEN TRUE ELSE FALSE
END AS google
FROM
    usersToken
WHERE
    usersToken.email = '${email}'`);
        if (result.length > 0) {
            return result[0];
        } else {
            return null;
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}
