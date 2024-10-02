import { IUsersConfigs } from '../utils/data.model';
import { db } from '../utils/database';
import log from '../utils/logger';

export async function getActions(id: string): Promise<any> {
    try {
        const result: any = await db
            .promise()
            .query('SELECT * FROM actions WHERE id=?', id);
        return result[0];
    } catch (e) {
        log.error('get actions', e);
    }
}

export async function getReactions(id: string): Promise<any> {
    try {
        const result: any = await db
            .promise()
            .query('SELECT * FROM reactions WHERE id=?', id);
        return result[0];
    } catch (e) {
        log.error('get reaction', e);
    }
}

export async function getUsersConfigs(): Promise<IUsersConfigs[]> {
    let configs: IUsersConfigs[] = [];
    try {
        const result: any = await db
            .promise()
            .query('SELECT * FROM users_configs');
        if (result[0].length > 0) configs = result[0];
    } catch (e) {
        console.error(e);
    }
    return configs;
}
