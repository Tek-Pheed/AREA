import log from '../../utils/logger';
import { db } from '../../database/db';

interface presets {
    id: number;
    action_id: number;
    reaction_id: number;
}

export async function getPresetsConfigs(): Promise<presets[]> {
    try {
        const result: any = await db
            .promise()
            .query('SELECT * FROM preset_configs');
        return result[0];
    } catch (e) {
        log.error(e);
        return [];
    }
}
