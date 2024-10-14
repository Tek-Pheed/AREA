import { db } from '../../utils/database';
import log from '../../utils/logger';

export async function getUnsplashToken(email: string): Promise<any> {
    try {
        const result: any = await db
            .promise()
            .query(
                'SELECT unsplashAccessToken, unsplashRefreshToken FROM usersToken WHERE email = ?',
                email
            );
        if (result[0].length > 0) {
            let uAccessToken = result[0][0].unsplashAccessToken;
            return uAccessToken;
        } else {
            return false;
        }
    } catch (error) {
        log.error(error);
        return false;
    }
}
