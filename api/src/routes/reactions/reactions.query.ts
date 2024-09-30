import { db } from '../../database/db';

export async function getAllReactions(): Promise<any> {
    try {
        const result = await db.promise().query('SELECT * FROM reactions');
        if (result.length > 0) {
            return result[0];
        } else {
            return null;
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function getReactionAPI(): Promise<any> {
    try {
        const result = await db.promise().query('SELECT * FROM reactions_api');
        if (result.length > 0) {
            return result[0];
        } else {
            return null;
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}
