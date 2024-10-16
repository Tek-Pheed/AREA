import { getGoogleToken } from './google.query';
import log from '../../utils/logger';

const axios = require('axios');

export async function getEvents(email: string) {
    const { gAccessToken, gRefreshToken } = await getGoogleToken(email);
    const date = new Date();
    const rfc339 = date.toISOString();
    console.log(rfc339.split('T')[0]);
    try {
        const response = await axios.get(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${rfc339}`,
            {
                headers: {
                    Authorization: `Bearer ${gAccessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        for (let i = 0; i < response.data.items.length; i++) {
            if (
                response.data.items[i].start.dateTime.split('T')[0] ===
                rfc339.split('T')[0]
            )
                return [
                    {
                        name: 'title',
                        value: response.data.items[i].summary,
                    },
                    {
                        name: 'creator_email',
                        value: response.data.items[i].creator.email,
                    },
                    {
                        name: 'link',
                        value: response.data.items[i].htmlLink,
                    },
                ];
        }
        return false;
    } catch (err: any) {
        log.error(`getEvents ${err.status}`);
        return false;
    }
}
