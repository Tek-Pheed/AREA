import { createClip, sendChatMessage } from '../../apis/twitch/reactions';
import log from '../../utils/logger';
import { IBody } from '../../utils/data.model';

export async function sendMessageInStreamerChat(params: IBody, email: string) {
    let username = '';
    for (const param of params.reaction) {
        if (param.name === 'username') {
            username = param.value;
        } else if (param.name === 'message') {
            const result = await sendChatMessage(email, username, param.value);
            log.debug(result);
        }
    }
}

export async function createClipOnStream(params: IBody, email: string) {
    for (const param of params.reaction) {
        if (param.name === 'username') {
            const result = await createClip(email, param.value);
            log.debug(result);
        }
    }
}
