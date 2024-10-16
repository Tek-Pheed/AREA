import { getGoogleToken } from './google.query';
import log from '../../utils/logger';
const axios = require('axios');

export async function setEventCalendar(
    email: string,
    eventTitle: string,
    eventDescription: string,
    eventStart: string,
    eventEnd: string
) {
    const { gAccessToken, gRefreshToken } = await getGoogleToken(email);
    try {
        const event = {
            start: {
                dateTime: eventStart,
                timeZone: 'Europe/Paris',
            },
            end: {
                dateTime: eventEnd,
                timeZone: 'Europe/Paris',
            },

            summary: eventTitle,
            description: eventDescription,
        };

        const response = await axios.post(
            'https://www.googleapis.com/calendar/v3/calendars/primary/events',
            event,
            {
                headers: {
                    Authorization: `Bearer ${gAccessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data;
    } catch (err: any) {
        log.error(err);
        return null;
    }
}
