import {
    getActions,
    getReactions,
    getUsersConfigs,
} from '../query/usersConfig';
import { launchAction } from './action.manager';

export async function coreWS() {
    const configs = await getUsersConfigs();

    for (const config of configs) {
        const action = await getActions(`${config.actions_id}`);
        const reaction = await getReactions(`${config.reaction_id}`);
        await launchAction(
            action[0].title,
            config.body,
            config.email,
            reaction,
            Number(config.id)
        );
    }
}
