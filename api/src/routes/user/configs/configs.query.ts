import { Request } from 'express';
const jwt = require('jsonwebtoken');
import { db } from '../../../database/db';

export async function getAllUserConfigs(req: Request): Promise<any> {
    const token = req.headers.authorization;
    if (!token) return null;
    try {
        let webToken = token.toString().split(' ')[1];
        let decoded: any = jwt.verify(webToken, process.env.SECRET);
        const result: any = await db
            .promise()
            .query('SELECT * FROM users_configs WHERE email=?', decoded.email);
        console.log(result[0]);
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

export async function createUserConfig(body: any, token: string): Promise<any> {
    if (!token) return null;
    try {
        let webToken = token.toString().split(' ')[1];
        let decoded: any = jwt.verify(webToken, process.env.SECRET);
        body = [
            decoded.email,
            body[0],
            body[1],
            JSON.stringify(body[2]),
            JSON.stringify(body[3]),
            body[4],
        ];
        const result: any = await db
            .promise()
            .query(
                'INSERT INTO users_configs(email, actions_id, method, headers, body, reaction_id) VALUES (?, ?, ?, ?, ?, ?)',
                body
            );

        return true;
    } catch (e) {
        console.error(e);
    }
    return null;
}
