import { IBody, IBodySpecific } from '../../utils/data.model';
import {
    getDiscordLastServerName,
    getDiscordUsername,
} from '../../apis/discord/actions';
import { createVariable, readValue, setItem } from '../../utils/storage';
import { launchReaction } from '../reaction.manager';

export async function whenJoinNewServer(
    params: IBody,
    email: string,
    reaction: any
) {
    const result = await getDiscordLastServerName(email);
    if (result !== false) {
        const actionsLabels: IBodySpecific[] = result;
        await launchReaction(reaction[0].title, params, actionsLabels, email);
    }
}

export async function whenUsernameChange(
    params: IBody,
    email: string,
    reaction: any
) {
    const result = await getDiscordUsername(email);
    const key = `${email}-discord`;
    await createVariable(key);
    if (result !== false) {
        if ((await readValue(key))['username'] !== result[0].value) {
            await setItem(key, 'username', result[0].value);
            const actionsLabels: IBodySpecific[] = result;
            await launchReaction(
                reaction[0].title,
                params,
                actionsLabels,
                email
            );
        }
    }
}
