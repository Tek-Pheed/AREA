import { IBody } from '../utils/data.model';
import log from '../utils/logger';
import { whenListenSpecificSound } from './actions/spotify.actions';
import {
    getCurrentGameOfStreamer,
    getMostViewedCategory,
    getSpecificTitle,
    liveStart,
} from './actions/twitch.actions';
import { getLastCommitOfSpecificUser } from './actions/github.actions';

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
            await getLastCommitOfSpecificUser(params, email, reaction);
            break;
        default:
            break;
    }
}
