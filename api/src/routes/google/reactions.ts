import { getGoogleToken } from './google.query';

const axios = require('axios');

export async function setEventCalendar(
    email: string,
    eventTitle: string,
    eventDescription: string,
    eventDate: string
) {
    const { gAccessToken, gRefreshToken } = await getGoogleToken(email);
    try {
        const event = {
            start: {
                dateTime: eventDate,
                timeZone: 'Europe/Paris',
            },
            end: {
                dateTime: eventDate,
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
        console.error(
            'Error setting event:',
            err.response ? err.response.data : err.message
        );
        return null;
    }
}
