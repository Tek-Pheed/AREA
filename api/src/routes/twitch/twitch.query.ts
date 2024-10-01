import { db } from '../../database/db';

export async function getTwitchToken(email: string): Promise<any> {
    try {
        const result: any = await db
            .promise()
            .query(
                'SELECT usersToken.twitchAccessToken, usersToken.twitchRefreshToken FROM usersToken WHERE usersToken.email = ?',
                email
            );

        if (result[0].length > 0) {
            let sAccessToken = result[0][0].twitchAccessToken;
            let sRefreshToken = result[0][0].twitchRefreshToken;
            return { sAccessToken, sRefreshToken };
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}
