import { db } from './database';

export async function refreshAccessTokeninDB(
    email: string,
    service: string,
    accessToken: string
) {
    try {
        const result: any = await db
            .promise()
            .query(
                `UPDATE usersToken SET usersToken.${service}AccessToken = '${accessToken}' WHERE usersToken.email = '${email}'`
            );
        if (result[0].affectedRows > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}
