import {
    skipToNextSong,
    skipToPreviousSong,
    startPlaybackSong,
} from '../../apis/spotify/reactions';
import log from '../../utils/logger';
import { IBody } from '../../utils/data.model';

export async function startSpecificMusic(params: IBody, email: string) {
    for (const param of params.reaction) {
        if (param.name === 'songName') {
            const result = await startPlaybackSong(email, param.value);
            log.debug(result);
        }
    }
}

export async function skipToPreviousMusic(email: string) {
    const previousResult = await skipToPreviousSong(email);
    log.debug(previousResult);
}

export async function skipToNextMusic(email: string) {
    const previousResult = await skipToNextSong(email);
    log.debug(previousResult);
}
