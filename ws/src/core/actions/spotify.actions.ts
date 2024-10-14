import { getSpecificSong } from '../../apis/spotify/actions';
import { IBody, IBodySpecific } from '../../utils/data.model';
import { launchReaction } from '../reaction.manager';

export async function whenListenSpecificSound(
    params: IBody,
    email: string,
    reaction: any
) {
    for (const param of params.action) {
        if (param.name === 'songName') {
            const result = await getSpecificSong(email, param.value);
            if (result != false) {
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
}
