import { IBody, IBodySpecific } from '../../utils/data.model';
import { getEvents } from '../../apis/google/actions';
import { createVariable, readValue, setItem } from '../../utils/storage';
import { launchReaction } from '../reaction.manager';

export async function whenThereIsAEventToday(
    params: IBody,
    email: string,
    reaction: any
) {
    const result = await getEvents(email);
    const key = `${email}-google`;
    await createVariable(key);
    if (result !== false) {
        if ((await readValue(key))['nextEvent'] !== result[0].value) {
            await setItem(key, 'nextEvent', result[0].value);
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
