import { IBody } from '../../utils/data.model';
import log from '../../utils/logger';
import { setEventCalendar } from '../../apis/google/reactions';

export async function setEventInCalendar(params: IBody, email: string) {
    let data = [];
    for (const param of params.reaction) data.push(param.value);
    log.debug(data);
    const result = await setEventCalendar(
        email,
        data[0],
        data[1],
        data[2],
        data[3]
    );
    log.debug(result);
}
