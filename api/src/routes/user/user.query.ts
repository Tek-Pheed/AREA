import { Request } from 'express';
import { db } from '../../database/db';
import bcrypt from 'bcryptjs';
const jwt = require('jsonwebtoken');

export async function getCurrentUser(req: Request): Promise<any> {
    const token = req.headers.authorization;
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

export async function updateCurrentUser(
    token: string,
    body: any
): Promise<boolean> {
    if (!token) return false;
    try {
        let webToken = token.toString().split(' ')[1];
        let decoded: any = jwt.verify(webToken, process.env.SECRET);
        if (body.password) {
            const result: any = await db
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
            const result: any = await db
                .promise()
                .query(
                    `UPDATE users SET username=?, email=? WHERE email='${decoded.email}'`,
                    [body.username, body.email]
                );
        }
        return true;
    } catch (e) {
        console.error(e);
    }
    return false;
}
