import { db } from '../../utils/database';
import log from '../../utils/logger';

export async function getDiscordToken(email: string): Promise<any> {
    try {
        const result: any = await db
            .promise()
            .query(
                'SELECT discordAccessToken, discordRefreshToken FROM usersToken WHERE email = ?',
                email
            );
        if (result[0].length > 0) {
            let dAccessToken = result[0][0].discordAccessToken;
            let dRefreshToken = result[0][0].discordRefreshToken;
            return { dAccessToken, dRefreshToken };
        } else {
            return false;
        }
    } catch (error) {
        log.error(error);
        return false;
    }
}
