import { getEvents } from '../../../apis/google/actions';
import { getGoogleToken } from '../../../apis/google/google.query';
import axios from 'axios';
import { db, pool } from '../../../utils/database';

jest.mock('axios');
jest.mock('../../../apis/google/google.query');
jest.mock('../../../utils/logger');

describe('getEvents', () => {
    const email = 'test@example.com';
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

    it('should return event details if events are found for the current date', async () => {
        const mockDate = new Date();
        const rfc339 = mockDate.toISOString();
        const mockEvent = {
            summary: 'Test Event',
            creator: { email: 'creator@example.com' },
            htmlLink: 'http://example.com/event',
            start: { dateTime: rfc339 },
        };

        (getGoogleToken as jest.Mock).mockResolvedValue({
            gAccessToken,
            gRefreshToken,
        });
        (axios.get as jest.Mock).mockResolvedValue({
            data: { items: [mockEvent] },
        });

        const result = await getEvents(email);

        expect(getGoogleToken).toHaveBeenCalledWith(email);
        expect(axios.get).toHaveBeenCalledWith(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${rfc339}`,
            {
                headers: {
                    Authorization: `Bearer ${gAccessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        expect(result).toEqual([
            { name: 'title', value: mockEvent.summary },
            { name: 'creator_email', value: mockEvent.creator.email },
            { name: 'link', value: mockEvent.htmlLink },
        ]);
        await new Promise((r) => setTimeout(r, 3500));
    }, 5000);

    it('should return false if no events are found for the current date', async () => {
        const mockDate = new Date();
        const rfc339 = mockDate.toISOString();

        (getGoogleToken as jest.Mock).mockResolvedValue({
            gAccessToken,
            gRefreshToken,
        });
        (axios.get as jest.Mock).mockResolvedValue({ data: { items: [] } });

        const result = await getEvents(email);

        expect(getGoogleToken).toHaveBeenCalledWith(email);
        expect(axios.get).toHaveBeenCalledWith(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${rfc339}`,
            {
                headers: {
                    Authorization: `Bearer ${gAccessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        expect(result).toBe(false);
        await new Promise((r) => setTimeout(r, 3500));
    }, 5000);

    it('should return false and log error if an error occurs', async () => {
        const mockError = new Error('Network Error');

        (getGoogleToken as jest.Mock).mockResolvedValue({
            gAccessToken,
            gRefreshToken,
        });
        (axios.get as jest.Mock).mockRejectedValue(mockError);

        const result = await getEvents(email);

        expect(getGoogleToken).toHaveBeenCalledWith(email);
        expect(axios.get).toHaveBeenCalled();
        expect(result).toBe(false);
        await new Promise((r) => setTimeout(r, 3500));
    }, 5000);
});
