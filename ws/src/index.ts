import dbConnect from './utils/database';
import { getActions, getReactions, getUsersConfigs } from './query/usersConfig';
import log from './utils/logger';
import { getSpecificSong } from './apis/spotify/actions';
import { IBody, IBodySpecific } from './utils/data.model';
import { skipToNextSong, startPlaybackSong } from './apis/spotify/reactions';
import { getStreamerStatus } from './apis/twitch/actions';
import { getTwitchToken } from './apis/twitch/twitch.query';
require('dotenv').config();

async function launchReaction(func: string, params: IBody, email: string) {
    log.info('Reaction: ' + func);
    switch (func) {
        case 'Skip to next':
            const result = await skipToNextSong(email);
            log.info(result);
            break;
        case 'Start music':
            for (const param of params.reaction) {
                if (param.name === 'songName') {
                    const result = await startPlaybackSong(email, param.value);
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
    log.info('Action: ' + func);
    switch (func) {
        case 'When listen specific sound':
            for (const param of params.action) {
                if (param.name === 'songName') {
                    const result = await getSpecificSong(email, param.value);
                    log.info(result);
                    if (result != false) {
                        await launchReaction(reaction[0].title, params, email);
                    }
                }
            }
            break;
        case 'Live starting':
            for (const param of params.action) {
                if (param.name === 'StreamUsername') {
                    const result = await getStreamerStatus(
                        await getTwitchToken(email),
                        param.value
                    );
                    log.info(result);
                    if (result != false) {
                        await launchReaction(reaction[0].title, params, email);
                    }
                }
            }
    }
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
    await reloadWS();
    setInterval(async () => {
        await reloadWS();
    }, 60000);
});
