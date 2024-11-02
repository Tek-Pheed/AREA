import request from 'supertest';
import {
    getDiscordLastServerName,
    getDiscordUsername,
} from '../../../apis/discord/actions';
import { refreshDiscordToken } from '../../../utils/refresh';
import { getDiscordToken } from '../../../apis/discord/discord.query';
import { createVariable, readValue, setItem } from '../../../utils/storage';
import axios from 'axios';
import { db, pool } from '../../../utils/database';

jest.mock('axios');
jest.mock('../../../utils/refresh');
jest.mock('../../../apis/discord/discord.query');
jest.mock('../../../utils/storage');

describe('Discord Actions', () => {
    const email = 'test@example.com';
    const id = 123;

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

    describe('getDiscordLastServerName', () => {
        it('should return the last server name if a new server is found', async () => {
            const token = {
                dAccessToken: 'access_token',
                dRefreshToken: 'refresh_token',
            };
            const servers = [
                { id: 1, name: 'Server1' },
                { id: 2, name: 'Server2' },
            ];
            const serverStorage = [1];

            (getDiscordToken as jest.Mock).mockResolvedValue(token);
            (axios.get as jest.Mock).mockResolvedValue({ data: servers });
            (readValue as jest.Mock).mockResolvedValue({
                allServers: serverStorage,
            });

            const result = await getDiscordLastServerName(email, id);

            expect(result).toEqual([{ name: 'serverName', value: 'Server2' }]);
            expect(createVariable).toHaveBeenCalledWith(
                `${email}-discord-${id}`
            );
            expect(setItem).toHaveBeenCalledWith(
                `${email}-discord-${id}`,
                'allServers',
                [1, 2]
            );
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);

        it('should return false if no new server is found', async () => {
            const token = {
                dAccessToken: 'access_token',
                dRefreshToken: 'refresh_token',
            };
            const servers = [{ id: 1, name: 'Server1' }];
            const serverStorage = [1];

            (getDiscordToken as jest.Mock).mockResolvedValue(token);
            (axios.get as jest.Mock).mockResolvedValue({ data: servers });
            (readValue as jest.Mock).mockResolvedValue({
                allServers: serverStorage,
            });

            const result = await getDiscordLastServerName(email, id);

            expect(result).toBe(false);
            expect(createVariable).toHaveBeenCalledWith(
                `${email}-discord-${id}`
            );
            expect(setItem).toHaveBeenCalledWith(
                `${email}-discord-${id}`,
                'allServers',
                [1]
            );
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);

        it('should refresh token and return false on error', async () => {
            const token = {
                dAccessToken: 'access_token',
                dRefreshToken: 'refresh_token',
            };

            (getDiscordToken as jest.Mock).mockResolvedValue(token);
            (axios.get as jest.Mock).mockRejectedValue(
                new Error('Network Error')
            );

            const result = await getDiscordLastServerName(email, id);

            expect(result).toBe(false);
            expect(refreshDiscordToken).toHaveBeenCalledWith(
                email,
                token.dRefreshToken
            );
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);
    });

    describe('getDiscordUsername', () => {
        it('should return the username if found', async () => {
            const token = {
                dAccessToken: 'access_token',
                dRefreshToken: 'refresh_token',
            };
            const userData = { global_name: 'TestUser' };

            (getDiscordToken as jest.Mock).mockResolvedValue(token);
            (axios.get as jest.Mock).mockResolvedValue({ data: userData });

            const result = await getDiscordUsername(email);

            expect(result).toEqual([{ name: 'username', value: 'TestUser' }]);
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);

        it('should return false if no username is found', async () => {
            const token = {
                dAccessToken: 'access_token',
                dRefreshToken: 'refresh_token',
            };

            (getDiscordToken as jest.Mock).mockResolvedValue(token);
            (axios.get as jest.Mock).mockResolvedValue({ data: null });

            const result = await getDiscordUsername(email);

            expect(result).toBe(false);
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);

        it('should refresh token and return false on error', async () => {
            const token = {
                dAccessToken: 'access_token',
                dRefreshToken: 'refresh_token',
            };

            (getDiscordToken as jest.Mock).mockResolvedValue(token);
            (axios.get as jest.Mock).mockRejectedValue(
                new Error('Network Error')
            );

            const result = await getDiscordUsername(email);

            expect(result).toBe(false);
            expect(refreshDiscordToken).toHaveBeenCalledWith(
                email,
                token.dRefreshToken
            );
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);
    });
});
