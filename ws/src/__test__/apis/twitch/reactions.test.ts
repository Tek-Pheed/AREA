import request from 'supertest';
import {
    getBroadcasterId,
    createClip,
    sendChatMessage,
} from '../../../apis/twitch/reactions';
import { getTwitchToken } from '../../../apis/twitch/twitch.query';
import { getUserId } from '../../../apis/twitch/actions';
import { refreshTwitchToken } from '../../../utils/refresh';
import axios from 'axios';

jest.mock('axios');
jest.mock('../../../apis/twitch/twitch.query');
jest.mock('../../../apis/twitch/actions');
jest.mock('../../../utils/refresh');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedGetTwitchToken = getTwitchToken as jest.MockedFunction<
    typeof getTwitchToken
>;
const mockedGetUserId = getUserId as jest.MockedFunction<typeof getUserId>;
const mockedRefreshTwitchToken = refreshTwitchToken as jest.MockedFunction<
    typeof refreshTwitchToken
>;

describe('Twitch Reactions API', () => {
    const email = 'test@example.com';
    const broadcasterUsername = 'testuser';
    const message = 'Hello, world!';
    const token = 'test-token';
    const refreshToken = 'test-refresh-token';
    const broadcasterId = '123456';
    const senderId = '654321';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getBroadcasterId', () => {
        it('should return broadcaster ID if found', async () => {
            mockedAxios.get.mockResolvedValue({
                data: {
                    data: [{ id: broadcasterId }],
                },
            });

            const result = await getBroadcasterId(
                token,
                broadcasterUsername,
                refreshToken,
                email
            );
            expect(result).toBe(broadcasterId);
        });

        it('should return null if broadcaster not found', async () => {
            mockedAxios.get.mockResolvedValue({
                data: {
                    data: [],
                },
            });

            const result = await getBroadcasterId(
                token,
                broadcasterUsername,
                refreshToken,
                email
            );
            expect(result).toBeNull();
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);

        it('should refresh token and return null on error', async () => {
            mockedAxios.get.mockRejectedValue(new Error('Network error'));

            const result = await getBroadcasterId(
                token,
                broadcasterUsername,
                refreshToken,
                email
            );
            expect(result).toBeNull();
            expect(mockedRefreshTwitchToken).toHaveBeenCalledWith(
                email,
                refreshToken
            );
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);
    });

    describe('createClip', () => {
        it('should create a clip successfully', async () => {
            mockedGetTwitchToken.mockResolvedValue({
                tAccessToken: token,
                tRefreshToken: refreshToken,
            });
            mockedAxios.get.mockResolvedValue({
                data: {
                    data: [{ id: broadcasterId }],
                },
            });
            mockedAxios.post.mockResolvedValue({ status: 202 });

            const result = await createClip(email, broadcasterUsername);
            expect(result).toBe(true);
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);

        it('should return null if broadcaster ID is not found', async () => {
            mockedGetTwitchToken.mockResolvedValue({
                tAccessToken: token,
                tRefreshToken: refreshToken,
            });
            mockedAxios.get.mockResolvedValue({
                data: {
                    data: [],
                },
            });

            const result = await createClip(email, broadcasterUsername);
            expect(result).toBeNull();
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);

        it('should return false on error and refresh token', async () => {
            mockedGetTwitchToken.mockResolvedValue({
                tAccessToken: token,
                tRefreshToken: refreshToken,
            });
            mockedAxios.get.mockResolvedValue({
                data: {
                    data: [{ id: broadcasterId }],
                },
            });
            mockedAxios.post.mockRejectedValue(new Error('Network error'));

            const result = await createClip(email, broadcasterUsername);
            expect(result).toBe(false);
            expect(mockedRefreshTwitchToken).toHaveBeenCalledWith(
                email,
                refreshToken
            );
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);
    });

    describe('sendChatMessage', () => {
        it('should send a chat message successfully', async () => {
            mockedGetTwitchToken.mockResolvedValue({
                tAccessToken: token,
                tRefreshToken: refreshToken,
            });
            mockedAxios.get.mockResolvedValue({
                data: {
                    data: [{ id: broadcasterId }],
                },
            });
            mockedGetUserId.mockResolvedValue(senderId);
            mockedAxios.post.mockResolvedValue({ status: 200 });

            const result = await sendChatMessage(
                email,
                broadcasterUsername,
                message
            );
            expect(result).toBe(true);
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);

        it('should return null if broadcaster ID or sender ID is not found', async () => {
            mockedGetTwitchToken.mockResolvedValue({
                tAccessToken: token,
                tRefreshToken: refreshToken,
            });
            mockedAxios.get.mockResolvedValue({
                data: {
                    data: [],
                },
            });

            const result = await sendChatMessage(
                email,
                broadcasterUsername,
                message
            );
            expect(result).toBeNull();
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);

        it('should return false on error and refresh token', async () => {
            mockedGetTwitchToken.mockResolvedValue({
                tAccessToken: token,
                tRefreshToken: refreshToken,
            });
            mockedAxios.get.mockResolvedValue({
                data: {
                    data: [{ id: broadcasterId }],
                },
            });
            mockedGetUserId.mockResolvedValue(senderId);
            mockedAxios.post.mockRejectedValue(new Error('Network error'));

            const result = await sendChatMessage(
                email,
                broadcasterUsername,
                message
            );
            expect(result).toBe(false);
            expect(mockedRefreshTwitchToken).toHaveBeenCalledWith(
                email,
                refreshToken
            );
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);
    });
});
