import { access } from 'fs';
import { db } from '../../database/db';
import jwt from 'jsonwebtoken';

export async function insertTokeninDb(
    provider: string,
    accessToken: string,
    refreshToken: string,
    email: string
) {
    try {
        await db
            .promise()
            .query(
                `UPDATE usersToken SET ${provider}AccessToken='${accessToken}', ${provider}RefreshToken='${refreshToken}' WHERE email='${email}'`
            );
    } catch (e) {
        console.error(e);
    }
}

export async function getAllConnections(token: string): Promise<any> {
    if (!token) return null;
    try {
        let webToken = token.toString().split(' ')[1];
        // @ts-ignore
        let decoded: any = jwt.verify(webToken, process.env.SECRET);
        const result: any = await db
            .promise()
            .query('SELECT * FROM usersToken WHERE email=?', decoded.email);

        if (result[0].length > 0) {
            return result[0];
        } else {
            return null;
        }
    } catch (e) {
        console.error(e);
    }
    return null;
}
