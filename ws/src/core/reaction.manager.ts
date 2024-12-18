import { IBody, IBodySpecific } from '../utils/data.model';
import log from '../utils/logger';
import {
    skipToNextMusic,
    skipToPreviousMusic,
    startSpecificMusic,
} from './reactions/spotify.reactions';
import {
    createClipOnStream,
    sendMessageInStreamerChat,
} from './reactions/twitch.reactions';
import {
    createComment,
    createIssueOnRepo,
    createPR,
    mergePR,
    reRunFailedWorkflow,
    reRunWorkflow,
} from './reactions/github.reactions';
import { setEventInCalendar } from './reactions/google.reactions';
import { likePhotoReaction } from './reactions/unsplash.reaction';
import { nexusReactions } from './reactions/nexus.reactions';

export function replaceLabel(
    label: string,
    paramName: string,
    value: string
): string {
    label = label.replace(`{{${paramName}}}`, value);
    return label;
}

export async function launchReaction(
    func: string,
    params: IBody,
    actionParam: IBodySpecific[],
    email: string
) {
    if (
        actionParam.length > 0 &&
        params.reaction.length > 0 &&
        params.reaction[0].reaction === undefined
    ) {
        for (const reaction of params.reaction) {
            for (const action of actionParam) {
                reaction.value = replaceLabel(
                    reaction.value,
                    action.name,
                    action.value
                );
                log.debug(reaction.value);
            }
        }
    }
    log.info(`email:${email} Reaction: ${func}`);
    switch (func) {
        case 'Skip to next':
            await skipToNextMusic(email);
            break;
        case 'Skip to previous':
            await skipToPreviousMusic(email);
            break;
        case 'Start music':
            await startSpecificMusic(params, email);
            break;
        case 'Create clip':
            await createClipOnStream(params, email);
            break;
        case 'Send message in chat':
            await sendMessageInStreamerChat(params, email);
            break;
        case 'Create Issue':
            await createIssueOnRepo(params, email);
            break;
        case 'Create Pull Request':
            await createPR(params, email);
            break;
        case 'Merge Pull Request':
            await mergePR(params, email);
            break;
        case 'Create Issue/PR Comment':
            await createComment(params, email);
            break;
        case 'Re-run failed workflow':
            await reRunFailedWorkflow(params, email);
            break;
        case 'Re-run a workflow':
            await reRunWorkflow(params, email);
            break;
        case 'Add event':
            await setEventInCalendar(params, email);
            break;
        case 'Like a photo':
            await likePhotoReaction(params, email);
            break;
        case 'Multiple reactions':
            await nexusReactions(params, actionParam, email);
            break;
        default:
            break;
    }
}
