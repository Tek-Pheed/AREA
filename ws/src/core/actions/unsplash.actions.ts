import { getUserLastPictures } from '../../apis/unsplash/actions';
import { IBody, IBodySpecific } from '../../utils/data.model';
import { launchReaction } from '../reaction.manager';
import log from '../../utils/logger';
import { createVariable, readValue, setItem } from '../../utils/storage';

export async function whenPostPhoto(
    params: IBody,
    email: string,
    reaction: any,
    id: Number
) {
    const data: any[] = [];
    for (const param of params.action) {
        data.push(param.value);
    }
    const result = await getUserLastPictures(email, data[0]);
    const key = `${email}-unsplash-${id}`;
    await createVariable(key);
    if (result !== false) {
        if ((await readValue(key))['lastPostID'] !== result[0].value) {
            setItem(key, 'lastPostID', result[0].value);
            const actionsLabels: IBodySpecific[] = result;
            await launchReaction(
                reaction[0].title,
                params,
                actionsLabels,
                email
            );
            log.debug(result);
        }
    }
}
