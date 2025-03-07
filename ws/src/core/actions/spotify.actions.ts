import { getSpecificSong, isPlaying } from '../../apis/spotify/actions';
import { IBody, IBodySpecific } from '../../utils/data.model';
import { launchReaction } from '../reaction.manager';

export async function whenListenSpecificSong(
    params: IBody,
    email: string,
    reaction: any,
    id: Number
) {
    for (const param of params.action) {
        if (param.name === 'songName') {
            const result = await isPlaying(email);
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

export async function whenListenSpecificSound(
    params: IBody,
    email: string,
    reaction: any,
    id: Number
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

export async function whenListen(
    params: IBody,
    email: string,
    reaction: any,
    id: Number
) {
    const result = await isPlaying(email);
    if (result !== false) {
        const actionsLabels: IBodySpecific[] = result;
        await launchReaction(reaction[0].title, params, actionsLabels, email);
    }
}
