import { IBody, IBodySpecific } from '../../utils/data.model';
import { getCommitFromSpecificUser } from '../../apis/github/actions';
import log from '../../utils/logger';
import fs from 'fs';
import { createVariable, setItem } from '../../utils/storage';
import { launchReaction } from '../reaction.manager';

export async function getLastCommitOfSpecificUser(
    params: IBody,
    email: string,
    reaction: any
) {
    let data: any[] = [];
    for (const param of params.action) data.push(param.value);
    const result = await getCommitFromSpecificUser(data[0], data[1], email);
    const key: string = `${email}-${data[0]}-${data[1]}-commit`;
    await createVariable(key);
    const storage = JSON.parse(fs.readFileSync('storage.json', 'utf8'));
    if (result !== false) {
        if (!storage[key].sha) {
            if (storage[key].sha !== result[0].value) {
                const actionsLabels: IBodySpecific[] = result;
                await setItem(key, 'sha', result[0].value);
                await launchReaction(
                    reaction[0].title,
                    params,
                    actionsLabels,
                    email
                );
            }
        } else {
            await setItem(key, 'sha', result[0].value);
        }
    }
}
