import { db } from '../../utils/database';

export async function getGoogleToken(email: string): Promise<any> {
    try {
        const result: any = await db
            .promise()
            .query(
                'SELECT usersToken.googleAccessToken, usersToken.googleRefreshToken FROM usersToken WHERE usersToken.email = ?',
                email
            );

        if (result[0].length > 0) {
            let gAccessToken = result[0][0].googleAccessToken;
            let gRefreshToken = result[0][0].googleRefreshToken;
            return { gAccessToken, gRefreshToken };
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}
