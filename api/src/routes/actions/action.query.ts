import { db } from '../../database/db';

export async function getAllActions(): Promise<any> {
    try {
        const result = await db.promise().query('SELECT * FROM actions');
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