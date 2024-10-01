import { db } from '../../database/db';

export async function getAllActions(): Promise<any> {
    try {
        const result = await db.promise().query('SELECT * FROM actions');
        return result[0];
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function getActionsAPI(): Promise<any> {
    try {
        const result = await db.promise().query('SELECT * FROM actions_api');
        return result[0];
    } catch (e) {
        console.error(e);
        return null;
    }
}
