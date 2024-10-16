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
    reaction: any
) {
    log.info(`When ${func}`);
    switch (func) {
        case 'Listen specific sound':
            await whenListenSpecificSound(params, email, reaction);
            break;
        case 'Live starting':
            await liveStart(params, email, reaction);
            break;
        case 'Specific game streamed':
            await getCurrentGameOfStreamer(params, email, reaction);
            break;
        case 'Specific live title':
            await getSpecificTitle(params, email, reaction);
            break;
        case 'Game is the most streamed':
            await getMostViewedCategory(params, email, reaction);
            break;
        case 'Commit Specific User':
            await whenNewCommitByMe(params, email, reaction);
            break;
        case 'Github action failed':
            await whenLastWorkflowFailed(params, email, reaction);
            break;
        case 'Github action success':
            await whenLastWorkflowSuccess(params, email, reaction);
            break;
        case 'Github action in progress':
            await whenLastWorkflowInProgress(params, email, reaction);
            break;
        case 'Join new server':
            await whenJoinNewServer(params, email, reaction);
            break;
        case 'Change username':
            await whenUsernameChange(params, email, reaction);
            break;
        case 'Event today':
            await whenThereIsAEventToday(params, email, reaction);
            break;
        case 'Post a picture':
            await whenPostPhoto(params, email, reaction);
            break;
        case 'Listen to music':
            await whenListen(params, email, reaction);
            break;
        default:
            break;
    }
}
