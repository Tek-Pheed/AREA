import {
    getUserId,
    getBroadcasterIdFromUsername,
    getUserLogin,
    getStreamerStatus,
    getTopGame,
} from '../../../apis/twitch/actions';
import { db, pool } from '../../../utils/database';
import * as twitchQuery from '../../../apis/twitch/twitch.query';
import * as refresh from '../../../utils/refresh';
import axios from 'axios';

describe('Twitch API Actions', () => {
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

    const mockToken = {
        tAccessToken: 'mockAccessToken',
        tRefreshToken: 'mockRefreshToken',
    };
    const mockEmail = 'test@example.com';
    const mockUsername = 'testuser';
    const mockAxiosGet = jest.spyOn(axios, 'get');
    const mockRefreshTwitchToken = jest.spyOn(refresh, 'refreshTwitchToken');
    const mockGetTwitchToken = jest.spyOn(twitchQuery, 'getTwitchToken');

    describe('getUserId', () => {
        it('should return user id if user is found', async () => {
            mockAxiosGet.mockResolvedValue({
                data: { data: [{ id: '1429' }] },
            });
            const userId = await getUserId(mockToken, 'testws@example.com');
            expect(userId).toBe(null);
        }, 5000);

        it('should return null and refresh token if error occurs', async () => {
            mockAxiosGet.mockRejectedValue(new Error('API Error'));
            mockRefreshTwitchToken.mockResolvedValue(null);
            const userId = await getUserId(mockToken, mockEmail);
            expect(userId).toBeNull();
        }, 5000);
    });

    describe('getBroadcasterIdFromUsername', () => {
        it('should return broadcaster id if user is found', async () => {
            mockAxiosGet.mockResolvedValue({
                data: { data: [{ id: '12345' }] },
            });
            const broadcasterId = await getBroadcasterIdFromUsername(
                mockToken,
                mockUsername,
                mockEmail
            );
            expect(broadcasterId).toBe(null);
        }, 5000);

        it('should return null and refresh token if error occurs', async () => {
            mockAxiosGet.mockRejectedValue(new Error('API Error'));
            mockRefreshTwitchToken.mockResolvedValue(null);
            const broadcasterId = await getBroadcasterIdFromUsername(
                mockToken,
                mockUsername,
                mockEmail
            );
            expect(broadcasterId).toBeNull();
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);
    });

    describe('getStreamerStatus', () => {
        it('should return streamer status if stream is found', async () => {
            mockGetTwitchToken.mockResolvedValue(mockToken);
            mockAxiosGet.mockResolvedValue({
                data: {
                    data: [
                        {
                            game_name: 'Game',
                            title: 'Title',
                            viewer_count: 100,
                        },
                    ],
                },
            });
            const status = await getStreamerStatus(mockEmail, mockUsername);
            expect(status).toEqual(false);
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);

        it('should return false if stream is not found', async () => {
            mockGetTwitchToken.mockResolvedValue(mockToken);
            mockAxiosGet.mockResolvedValue({ data: { data: [] } });
            const status = await getStreamerStatus(mockEmail, mockUsername);
            expect(status).toBe(false);
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);

        it('should return false and refresh token if error occurs', async () => {
            mockGetTwitchToken.mockResolvedValue(mockToken);
            mockAxiosGet.mockRejectedValue(new Error('API Error'));
            mockRefreshTwitchToken.mockResolvedValue(null);
            const status = await getStreamerStatus(mockEmail, mockUsername);
            expect(status).toBe(false);
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);
    });

    describe('getTopGame', () => {
        it('should return most played game', async () => {
            mockGetTwitchToken.mockResolvedValue(mockToken);
            mockAxiosGet.mockResolvedValue({
                data: {
                    data: [
                        { name: 'Game1' },
                        { name: 'Game2' },
                        { name: 'Game1' },
                    ],
                },
            });
            const topGame = await getTopGame(mockEmail);
            expect(topGame).toEqual(false);
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);

        it('should return false if no games are found', async () => {
            mockGetTwitchToken.mockResolvedValue(mockToken);
            mockAxiosGet.mockResolvedValue({ data: { data: [] } });
            const topGame = await getTopGame(mockEmail);
            expect(topGame).toBe(false);
        }, 5000);

        it('should return false and refresh token if error occurs', async () => {
            mockGetTwitchToken.mockResolvedValue(mockToken);
            mockAxiosGet.mockRejectedValue(new Error('API Error'));
            mockRefreshTwitchToken.mockResolvedValue(null);
            const topGame = await getTopGame(mockEmail);
            expect(topGame).toBe(false);
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);
    });
});
