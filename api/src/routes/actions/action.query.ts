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

export async function getSpecificAction(id: string): Promise<any> {
    try {
        const result: any = await db
            .promise()
            .query('SELECT * FROM actions WHERE id=?', id);
        if (result[0].length > 0) {
            return result[0];
        } else {
            return null;
        }
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
