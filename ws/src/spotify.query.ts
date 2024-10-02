import { db } from './utils/database';

export async function getSpotifyToken(email: string): Promise<any> {
    try {
        const result: any = await db
            .promise()
            .query(
                'SELECT usersToken.spotifyAccessToken, usersToken.spotifyRefreshToken FROM usersToken WHERE usersToken.email = ?',
                email
            );

        if (result[0].length > 0) {
            let sAccessToken = result[0][0].spotifyAccessToken;
            let sRefreshToken = result[0][0].spotifyRefreshToken;
            return { sAccessToken, sRefreshToken };
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}
