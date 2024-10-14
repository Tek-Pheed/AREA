import { db } from '../../utils/database';
import log from '../../utils/logger';

export async function getGithubToken(email: string): Promise<any> {
    try {
        const result: any = await db
            .promise()
            .query(
                'SELECT githubAccessToken, githubRefreshToken FROM usersToken WHERE email = ?',
                email
            );
        if (result[0].length > 0) {
            let gAccessToken = result[0][0].githubAccessToken;
            let gRefreshToken = result[0][0].githubRefreshToken;
            return { gAccessToken, gRefreshToken };
        } else {
            return false;
        }
    } catch (error) {
        log.error(error);
        return false;
    }
}