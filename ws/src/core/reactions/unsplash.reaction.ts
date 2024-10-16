import { IBody } from '../../utils/data.model';
import { likePhoto } from '../../apis/unsplash/reactions';
import log from '../../utils/logger';

export async function likePhotoReaction(params: IBody, email: string) {
    let data: any[] = [];
    for (const param of params.reaction) data.push(param.value);
    const result = await likePhoto(email, data[0]);
    log.debug(result);
}
