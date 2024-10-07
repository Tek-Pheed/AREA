import { Request } from 'express';
const jwt = require('jsonwebtoken');
import { db } from '../../../database/db';

export async function getAllUserConfigs(token: string): Promise<any> {
    if (!token) return null;
    try {
        let webToken = token.toString().split(' ')[1];
        let decoded: any = jwt.verify(webToken, process.env.SECRET);
        const result: any = await db
            .promise()
            .query('SELECT * FROM users_configs WHERE email=?', decoded.email);
        return result[0];
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

export async function updateUserConfig(
    req_body: any,
    id: string
): Promise<boolean> {
    const { actions_id, method, headers, body, reactions_id } = req_body;
    if (!actions_id || !method || !headers || !body || !reactions_id)
        return false;
    try {
        const data = [
            actions_id,
            method,
            JSON.stringify(headers),
            JSON.stringify(body),
            reactions_id,
        ];
        await db
            .promise()
            .query(
                `UPDATE users_configs SET actions_id=?,method=?,headers=?,body=?,reaction_id=? WHERE id=${id}`,
                data
            );
        return true;
    } catch (e) {
        console.error(e);
    }
    return false;
}

export async function removeUserConfig(
    id: string,
    token: string
): Promise<boolean> {
    if (!token) return false;
    try {
        let webToken = token.toString().split(' ')[1];
        let decoded: any = jwt.verify(webToken, process.env.SECRET);
        await db
            .promise()
            .query('DELETE FROM users_configs WHERE email=? AND id=?', [
                decoded.email,
                id,
            ]);
        return true;
    } catch (e) {
        console.error(e);
    }
    return false;
}
