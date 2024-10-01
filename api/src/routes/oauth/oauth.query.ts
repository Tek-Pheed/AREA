import { access } from 'fs';
import { db } from '../../database/db';

export async function insertTokeninDb(
    provider: string,
    accessToken: string,
    refreshToken: string,
    email: string
) {
    await db
        .promise()
        .query(
            `UPDATE usersToken SET ${provider}AccessToken = ?, ${provider}RefreshToken = ? WHERE email = ?`,
            [accessToken, refreshToken, email]
        );
}


