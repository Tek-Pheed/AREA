import { IBody } from '../utils/data.model';
import log from '../utils/logger';
import { whenListen, whenListenSpecificSound } from './actions/spotify.actions';
import {
    getCurrentGameOfStreamer,
    getMostViewedCategory,
    getSpecificTitle,
    liveStart,
} from './actions/twitch.actions';
import {
    whenJoinNewServer,
    whenUsernameChange,
} from './actions/discord.actions';
import { whenThereIsAEventToday } from './actions/google.actions';
import {
    whenLastWorkflowFailed,
    whenLastWorkflowInProgress,
    whenLastWorkflowSuccess,
    whenNewCommitByMe,
} from './actions/github.actions';
import { whenPostPhoto } from './actions/unsplash.actions';

export async function launchAction(
    func: string,
    params: IBody,
    email: string,
    reaction: any,
    id: number
) {
    log.info(`email:${email} When ${func}`);
    switch (func) {
        case 'Listen specific sound':
            await whenListenSpecificSound(params, email, reaction, id);
            break;
        case 'User is streaming':
            await liveStart(params, email, reaction, id);
            break;
        case 'Specific game streamed':
            await getCurrentGameOfStreamer(params, email, reaction, id);
            break;
        case 'Specific live title':
            await getSpecificTitle(params, email, reaction, id);
            break;
        case 'Game is the most streamed':
            await getMostViewedCategory(params, email, reaction, id);
            break;
        case 'User commit on repository':
            await whenNewCommitByMe(params, email, reaction, id);
            break;
        case 'Github action failed':
            await whenLastWorkflowFailed(params, email, reaction, id);
            break;
        case 'Github action success':
            await whenLastWorkflowSuccess(params, email, reaction, id);
            break;
        case 'Github action in progress':
            await whenLastWorkflowInProgress(params, email, reaction, id);
            break;
        case 'Join new server':
            await whenJoinNewServer(params, email, reaction, id);
            break;
        case 'Change username':
            await whenUsernameChange(params, email, reaction, id);
            break;
        case 'Event today':
            await whenThereIsAEventToday(params, email, reaction, id);
            break;
        case 'Post a picture':
            await whenPostPhoto(params, email, reaction, id);
            break;
        case 'Listen to music':
            await whenListen(params, email, reaction, id);
            break;
        default:
            break;
    }
}
