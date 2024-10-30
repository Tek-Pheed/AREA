import { IBody, IBodySpecific } from '../../utils/data.model';
import {
    getActionInProgress,
    getActionWhenKo,
    getActionWhenOk,
    getCommitFromSpecificUser,
} from '../../apis/github/actions';
import log from '../../utils/logger';
import fs from 'fs';
import { createVariable, setItem } from '../../utils/storage';
import { launchReaction } from '../reaction.manager';

export async function whenNewCommitByMe(
    params: IBody,
    email: string,
    reaction: any
) {
    let data: any[] = [];
    for (const param of params.action) data.push(param.value);
    const result = await getCommitFromSpecificUser(
        data[0],
        data[1],
        data[2],
        email
    );
    const key: string = `${email}-${data[0]}-${data[1]}`;
    await createVariable(key);
    const storage = JSON.parse(fs.readFileSync('storage.json', 'utf8'));
    if (result.length === 0) {
        log.warn(
            `email:${email} service:Github No commit on this repositories`
        );
    } else if (result !== false) {
        if (!storage[key].commit_sha) {
            if (storage[key].commit_sha !== result[0].value) {
                const actionsLabels: IBodySpecific[] = result;
                await setItem(key, 'commit_sha', result[0].value);
                await launchReaction(
                    reaction[0].title,
                    params,
                    actionsLabels,
                    email
                );
            }
        } else {
            await setItem(key, 'commit_sha', result[0].value);
        }
    }
}

export async function whenLastWorkflowFailed(
    params: IBody,
    email: string,
    reaction: any
) {
    let data: any[] = [];
    for (const param of params.action) data.push(param.value);
    const result = await getActionWhenKo(data[0], data[1], email);
    const key: string = `${email}-${data[0]}-${data[1]}`;
    await createVariable(key);
    const storage = JSON.parse(fs.readFileSync('storage.json', 'utf8'));
    if (result.length === 0) {
        log.warn(`email:${email} service:Github No workflow have failed`);
    } else if (result !== false) {
        if (!storage[key].lastWorkflowKoID) {
            if (storage[key].lastWorkflowKoID !== result[0].value) {
                const actionsLabels: IBodySpecific[] = result;
                await setItem(key, 'lastWorkflowKoID', result[0].value);
                await launchReaction(
                    reaction[0].title,
                    params,
                    actionsLabels,
                    email
                );
            }
        } else {
            await setItem(key, 'lastWorkflowKoID', result[0].value);
        }
    }
}

export async function whenLastWorkflowSuccess(
    params: IBody,
    email: string,
    reaction: any
) {
    let data: any[] = [];
    for (const param of params.action) data.push(param.value);
    const result = await getActionWhenOk(data[0], data[1], email);
    const key: string = `${email}-${data[0]}-${data[1]}`;
    const storage = await createVariable(key);
    if (result.length === 0) {
        log.warn(`email:${email} service:Github No workflow success`);
    } else if (result !== false) {
        if (!storage[key].lastWorkflowOkID) {
            if (storage[key].lastWorkflowOkID !== result[0].value) {
                const actionsLabels: IBodySpecific[] = result;
                await setItem(key, 'lastWorkflowOkID', result[0].value);
                await launchReaction(
                    reaction[0].title,
                    params,
                    actionsLabels,
                    email
                );
            }
        } else {
            await setItem(key, 'lastWorkflowOkID', result[0].value);
        }
    }
}

export async function whenLastWorkflowInProgress(
    params: IBody,
    email: string,
    reaction: any
) {
    let data: any[] = [];
    for (const param of params.action) data.push(param.value);
    const result = await getActionInProgress(data[0], data[1], email);
    const key: string = `${email}-${data[0]}-${data[1]}`;
    const storage = await createVariable(key);
    if (result.length === 0) {
        log.warn(
            `email:${email} service:Github No workflow in progress currently`
        );
    } else if (result !== false) {
        if (!storage[key].lastWorkflowInProgressID) {
            if (storage[key].lastWorkflowInProgressID !== result[0].value) {
                const actionsLabels: IBodySpecific[] = result;
                await setItem(key, 'lastWorkflowInProgressID', result[0].value);
                await launchReaction(
                    reaction[0].title,
                    params,
                    actionsLabels,
                    email
                );
            }
        } else {
            await setItem(key, 'lastWorkflowInProgressID', result[0].value);
        }
    }
}
