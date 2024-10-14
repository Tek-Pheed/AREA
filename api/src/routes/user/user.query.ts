import { Request } from 'express';
import { db } from '../../database/db';
import bcrypt from 'bcryptjs';
import log from '../../utils/logger';
const jwt = require('jsonwebtoken');

export async function getCurrentUser(token: string): Promise<any> {
    if (!token) return null;
    try {
        let webToken = token.toString().split(' ')[1];
        let decoded: any = jwt.verify(webToken, process.env.SECRET);
        const result: any = await db
            .promise()
            .query(
                'SELECT id, email, username, create_at FROM users WHERE email=?',
                decoded.email
            );
        return result[0];
    } catch (e) {
        log.error(e);
    }
    return null;
}

export async function updateCurrentUser(
    token: string,
    body: any
): Promise<boolean> {
    if (!token) return false;
    try {
        let webToken = token.toString().split(' ')[1];
        let decoded: any = jwt.verify(webToken, process.env.SECRET);
        if (body.password) {
            await db
                .promise()
                .query(
                    `UPDATE users SET username=?, email=?, password=? WHERE email='${decoded.email}'`,
                    [
                        body.username,
                        body.email,
                        bcrypt.hashSync(body.password, 10),
                    ]
                );
        } else {
            await db
                .promise()
                .query(
                    `UPDATE users SET username=?, email=? WHERE email='${decoded.email}'`,
                    [body.username, body.email]
                );
        }
        return true;
    } catch (e) {
        log.error(e);
    }
    return false;
}
