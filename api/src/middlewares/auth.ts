import { Request, Response } from 'express';
import { db } from '../database/db';
import API from './api';
const jwt = require('jsonwebtoken');

async function userExist(email: string): Promise<boolean> {
    let result: any = await db
        .promise()
        .query('SELECT * FROM users WHERE email=?', email);
    return result[0].length > 0;
}

export async function auth(req: Request, res: Response, next: any) {
    const token = req.header('Authorization');
    if (!token) {
        res.status(401).json(
            API(401, true, 'No token, authorization denied', null)
        );
        return;
    }
    try {
        let webToken = token.toString().split(' ')[1];
        let decoded: any = jwt.verify(webToken, process.env.SECRET);
        if (!(await userExist(decoded.email))) {
            res.status(401).json(
                API(401, true, 'Bad credentials, authorization denied', null)
            );
            return;
        }
        next();
        return;
    } catch (err) {
        console.error(err);
        res.status(401).json(
            API(401, true, 'Bad token, authorization denied', null)
        );
        return;
    }
}
