import dbConnect from './utils/database';
import { getActions, getReactions, getUsersConfigs } from './query/usersConfig';
import log from './utils/logger';
import { getSpecificSong } from './apis/spotify/actions';
import { IBody, IBodySpecific } from './utils/data.model';
import {
    skipToNextSong,
    skipToPreviousSong,
    startPlaybackSong,
} from './apis/spotify/reactions';
import { getStreamerStatus } from './apis/twitch/actions';
import fs from 'fs';
import { createClip, sendChatMessage } from './apis/twitch/reactions';
require('dotenv').config();

function replaceLabel(label: string, paramName: string, value: string): string {
    label = label.replace(`{{${paramName}}}`, value);
    return label;
}

async function launchReaction(
    func: string,
    params: IBody,
    actionParam: IBodySpecific[],
    email: string
) {
    for (const reaction of params.reaction) {
        for (const action of actionParam) {
            reaction.value = replaceLabel(
                reaction.value,
                action.name,
                action.value
            );
            log.info(reaction.value);
        }
    }
    log.info(`Reaction: ${func}`);
    switch (func) {
        case 'Skip to next':
            const nextResult = await skipToNextSong(email);
            log.debug(nextResult);
            break;
        case 'Skip to previous':
            const previousResult = await skipToPreviousSong(email);
            log.debug(previousResult);
            break;
        case 'Start music':
            for (const param of params.reaction) {
                if (param.name === 'songName') {
                    const result = await startPlaybackSong(email, param.value);
                    log.debug(result);
                }
            }
            break;
        case 'Create clip':
            for (const param of params.reaction) {
                if (param.name === 'username') {
                    const result = await createClip(email, param.value);
                    log.debug(result);
                }
            }
            break;
        case 'Send message in chat':
            let username = '';
            for (const param of params.reaction) {
                if (param.name === 'username') {
                    username = param.value;
                } else if (param.name === 'message') {
                    const result = await sendChatMessage(
                        email,
                        username,
                        param.value
                    );
                    log.debug(result);
                }
            }
            break;
        default:
            break;
    }
}

async function launchAction(
    func: string,
    params: IBody,
    email: string,
    reaction: any
) {
    const storage = JSON.parse(fs.readFileSync('storage.json', 'utf8'));
    log.info(`When ${func}`);
    switch (func) {
        case 'Listen specific sound':
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
            break;
        case 'Live starting':
            for (const param of params.action) {
                if (param.name === 'StreamUsername') {
                    const key = email + param.name + param.value;
                    const result = await getStreamerStatus(email, param.value);
                    if (!storage[key]) storage[key] = {};
                    if (result != false) {
                        if (storage[key].isStream != true) {
                            storage[key].isStream = true;
                            const actionsLabels: IBodySpecific[] = result;
                            await launchReaction(
                                reaction[0].title,
                                params,
                                actionsLabels,
                                email
                            );
                        }
                    } else {
                        storage[key].isStream = false;
                    }
                }
            }
            break;
        default:
            break;
    }
    fs.writeFileSync('storage.json', JSON.stringify(storage));
}

async function reloadWS() {
    const configs = await getUsersConfigs();

    for (const config of configs) {
        const action = await getActions(`${config.actions_id}`);
        const reaction = await getReactions(`${config.reaction_id}`);
        await launchAction(
            action[0].title,
            config.body,
            config.email,
            reaction
        );
    }
}

dbConnect.then(async () => {
    log.info('Connected to DB...');
    if (!fs.existsSync('storage.json')) {
        fs.writeFileSync('storage.json', '{}');
    }
    await reloadWS();
    setInterval(async () => {
        await reloadWS();
    }, 60000);
});
