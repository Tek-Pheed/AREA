import {
    getCurrentGame,
    getCurrentTitle,
    getStreamerStatus,
    getTopGame,
} from '../../apis/twitch/actions';
import { createVariable, readValue, setItem } from '../../utils/storage';
import fs from 'fs';
import { IBody, IBodySpecific } from '../../utils/data.model';
import log from '../../utils/logger';
import { launchReaction } from '../reaction.manager';

export async function liveStart(params: IBody, email: string, reaction: any) {
    for (const param of params.action) {
        if (param.name === 'StreamUsername') {
            const key = `${email}-twitch`;
            const result = await getStreamerStatus(email, param.value);
            if (result != false) {
                await createVariable(key);
                if (!(await readValue(key))[`${param.value}IsStream`]) {
                    await setItem(key, `${param.value}IsStream`, true);
                    const actionsLabels: IBodySpecific[] = result;
                    await launchReaction(
                        reaction[0].title,
                        params,
                        actionsLabels,
                        email
                    );
                }
            } else {
                await setItem(key, `${param.value}IsStream`, false);
            }
        }
    }
}

export async function getCurrentGameOfStreamer(
    params: IBody,
    email: string,
    reaction: any
) {
    let game = [];
    for (const param of params.action) game.push(param.value);

    const gResult = await getCurrentGame(email, game[0], game[1]);
    log.debug(gResult);
    if (gResult) {
        const actionsLabels: IBodySpecific[] = gResult;
        await launchReaction(reaction[0].title, params, actionsLabels, email);
    }
}

export async function getSpecificTitle(
    params: IBody,
    email: string,
    reaction: any
) {
    let title = [];
    for (const param of params.action) title.push(param.value);
    const tResult = await getCurrentTitle(email, title[0], title[1]);
    log.debug(tResult);
    if (tResult) {
        const actionsLabels: IBodySpecific[] = tResult;
        await launchReaction(reaction[0].title, params, actionsLabels, email);
    }
}

export async function getMostViewedCategory(
    params: IBody,
    email: string,
    reaction: any
) {
    let most = [];
    for (const param of params.action) most.push(param.value);
    const mResult = await getTopGame(email);
    log.debug(mResult);
    const key = `${email}-twitch`;
    await createVariable(key);
    if (mResult[0].value === most[0]) {
        if ((await readValue(key))[`mostViewedCategory`] !== most[0]) {
            await setItem(key, `mostViewedCategory`, most[0]);
            const actionsLabels: IBodySpecific[] = mResult;
            await launchReaction(
                reaction[0].title,
                params,
                actionsLabels,
                email
            );
        }
    }
}
