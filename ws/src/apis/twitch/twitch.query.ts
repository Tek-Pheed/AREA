import { db } from '../../utils/database';

export async function getTwitchToken(email: string): Promise<any> {
    try {
        const result: any = await db
            .promise()
            .query(
                'SELECT twitchAccessToken, twitchRefreshToken FROM usersToken WHERE email = ?',
                email
            );
        if (result[0].length > 0) {
            let tAccessToken = result[0][0].twitchAccessToken;
            let tRefreshToken = result[0][0].twitchRefreshToken;
            return { tAccessToken, tRefreshToken };
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}
