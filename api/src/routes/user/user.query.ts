import { Request } from 'express';
import { db } from '../../database/db';
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
