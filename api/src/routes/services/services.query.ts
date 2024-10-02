import { db } from '../../database/db';

export async function getAllServices(): Promise<any> {
    try {
        const result: any = await db
            .promise()
            .query(
                'SELECT * FROM reactions_api UNION SELECT * FROM actions_api WHERE NOT EXISTS(SELECT * FROM reactions_api WHERE reactions_api.name = actions_api.name)'
            );
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
