import { db } from '../../database/db';

export async function getAllReactions(): Promise<any> {
    try {
        const result = await db.promise().query('SELECT * FROM reactions');
        return result[0];
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function getReactionAPI(): Promise<any> {
    try {
        const result = await db.promise().query('SELECT * FROM reactions_api');
        return result[0];
    } catch (e) {
        console.error(e);
        return null;
    }
}
