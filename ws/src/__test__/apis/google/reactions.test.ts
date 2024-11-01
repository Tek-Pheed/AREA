import request from 'supertest';
import { setEventCalendar } from '../../../apis/google/reactions';
import { getGoogleToken } from '../../../apis/google/google.query';
import axios from 'axios';
import log from '../../../utils/logger';
import { db, pool } from '../../../utils/database';

jest.mock('axios');
jest.mock('../../../apis/google/google.query');
jest.mock('../../../utils/logger');

describe('setEventCalendar', () => {
    const email = 'test@example.com';
    const eventTitle = 'Test Event';
    const eventDescription = 'This is a test event';
    const eventStart = '2023-10-01T10:00:00Z';
    const eventEnd = '2023-10-01T11:00:00Z';
    const gAccessToken = 'mockAccessToken';
    const gRefreshToken = 'mockRefreshToken';

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    afterAll(async () => {
        await new Promise<void>((resolve, reject) => {
            db.end((err) => {
                if (err) {
                    console.error('Error closing the connection:', err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        await new Promise<void>((resolve, reject) => {
            pool.end((err) => {
                if (err) {
                    console.error('Error closing pool connections:', err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    });

    it('should create an event and return the response data', async () => {
        (getGoogleToken as jest.Mock).mockResolvedValue({
            gAccessToken,
            gRefreshToken,
        });
        const mockResponse = { data: { id: 'eventId' } };
        (axios.post as jest.Mock).mockResolvedValue(mockResponse);

        const result = await setEventCalendar(
            email,
            eventTitle,
            eventDescription,
            eventStart,
            eventEnd
        );

        expect(getGoogleToken).toHaveBeenCalledWith(email);
        expect(axios.post).toHaveBeenCalledWith(
            'https://www.googleapis.com/calendar/v3/calendars/primary/events',
            {
                start: { dateTime: eventStart, timeZone: 'Europe/Paris' },
                end: { dateTime: eventEnd, timeZone: 'Europe/Paris' },
                summary: eventTitle,
                description: eventDescription,
            },
            {
                headers: {
                    Authorization: `Bearer ${gAccessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        expect(result).toEqual(mockResponse.data);
        await new Promise((r) => setTimeout(r, 3500));
    }, 5000);

    it('should log an error and return null if an error occurs', async () => {
        (getGoogleToken as jest.Mock).mockResolvedValue({
            gAccessToken,
            gRefreshToken,
        });
        const mockError = new Error('Test error');
        (axios.post as jest.Mock).mockRejectedValue(mockError);

        const result = await setEventCalendar(
            email,
            eventTitle,
            eventDescription,
            eventStart,
            eventEnd
        );

        expect(getGoogleToken).toHaveBeenCalledWith(email);
        expect(axios.post).toHaveBeenCalledWith(
            'https://www.googleapis.com/calendar/v3/calendars/primary/events',
            {
                start: { dateTime: eventStart, timeZone: 'Europe/Paris' },
                end: { dateTime: eventEnd, timeZone: 'Europe/Paris' },
                summary: eventTitle,
                description: eventDescription,
            },
            {
                headers: {
                    Authorization: `Bearer ${gAccessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        expect(log.error).toHaveBeenCalledWith(mockError);
        expect(result).toBeNull();
        await new Promise((r) => setTimeout(r, 3500));
    }, 5000);
});
