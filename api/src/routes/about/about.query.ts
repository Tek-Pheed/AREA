import { db } from '../../database/db';
import log from '../../utils/logger';

export async function getJsonAbout(): Promise<any> {
    //
    try {
        const result: any = await db.promise().query(
            `SELECT 
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'name', api.name,
            'actions', (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'name', a.title,
                        'description', a.description
                    )
                ) FROM actions a WHERE a.api_name = api.name
            ),
            'reactions', (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'name', r.title,
                        'description', r.description
                    )
                ) FROM reactions r WHERE r.api_name = api.name
            )
        )
    ) AS services
FROM actions_api api;
`
        );
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
