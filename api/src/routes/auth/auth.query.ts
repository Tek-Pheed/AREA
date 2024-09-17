import bcrypt from 'bcryptjs';
import { IUsers } from '../../utils/data.model';
const { db } = require('../../database/db');

export async function login(email: string, password: string): Promise<boolean> {
    if (!email || !password) {
        return false;
    }

    try {
        const result = await db
            .promise()
            .query('SELECT * FROM users WHERE email=?', email);

        if (result[0].length > 0) {
            let passwd = result[0][0].password;
            return bcrypt.compareSync(password, passwd);
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function register(body: IUsers): Promise<boolean> {
    const { email, password, username } = body;

    try {
        const result = await db
            .promise()
            .query(
                'INSERT INTO users (email, password, username) values (?, ?, ?)',
                [email, bcrypt.hashSync(password, 10), username]
            );
        return result.length > 0;
    } catch (err) {
        console.error(err);
        return false;
    }
}
