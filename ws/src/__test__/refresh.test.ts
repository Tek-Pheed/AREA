import { db, pool } from '../utils/database';
import {
    refreshSpotifyToken,
    refreshDiscordToken,
    refreshTwitchToken,
} from '../utils/refresh';

describe('refresh.ts', () => {
    afterAll(async () => {
        db.end((err) => {
            if (err) {
                console.error('Error closing the connection:', err);
            }
        });

        pool.end((err) => {
            if (err) {
                console.error('Error closing pool connections:', err);
            }
        });
    });

    describe('refreshSpotifyToken', () => {
        it('should return false when client ID or secret is missing', async () => {
            const originalClientId = process.env.SPOTIFY_CLIENT_ID;
            const originalClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
            process.env.SPOTIFY_CLIENT_ID = '';
            process.env.SPOTIFY_CLIENT_SECRET = '';
            const email = 'none@nomail.com';
            const refresh = 'some_refresh_token';
            const result = await refreshSpotifyToken(email, refresh);
            expect(result).toBe(false);
            process.env.SPOTIFY_CLIENT_ID = originalClientId;
            process.env.SPOTIFY_CLIENT_SECRET = originalClientSecret;
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);

        it('should return false when refresh token is null or undefined', async () => {
            const email = 'none@nomail.com';
            const refresh = undefined;
            const result = await refreshSpotifyToken(email, refresh!);
            expect(result).toBe(false);
        });
    });

    describe('refreshDiscordToken', () => {
        it('should return false when refresh token is null or undefined', async () => {
            const email = 'none@nomail.com';
            const refresh = undefined;
            const result = await refreshDiscordToken(email, refresh!);
            expect(result).toBe(false);
        });
    });

    describe('refreshTwitchToken', () => {
        it('should return false when refresh token is null or undefined', async () => {
            const email = 'none@nomail.com';
            const refresh = undefined;
            const result = await refreshTwitchToken(email, refresh!);
            expect(result).toBe(false);
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);
    });
});
