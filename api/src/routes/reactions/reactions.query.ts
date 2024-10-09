import { db } from '../../database/db';
import log from '../../utils/logger';

export async function getAllReactions(): Promise<any> {
    try {
        const result = await db.promise().query('SELECT * FROM reactions');
        return result[0];
    } catch (e) {
        log.error(e);
        return null;
    }
}

export async function getSpecificReaction(id: string): Promise<any> {
    try {
        const result: any = await db
            .promise()
            .query('SELECT * FROM reactions WHERE id=?', id);
        if (result[0].length > 0) {
            return result[0];
        } else {
            return null;
        }
    } catch (e) {
        log.error(e);
        return null;
    }
}

export async function getReactionAPI(): Promise<any> {
    try {
        const result = await db.promise().query('SELECT * FROM reactions_api');
        return result[0];
    } catch (e) {
        log.error(e);
        return null;
    }
}
