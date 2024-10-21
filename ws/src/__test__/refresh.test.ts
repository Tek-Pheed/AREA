import { getDiscordToken } from '../apis/discord/discord.query';
import { getSpotifyToken } from '../apis/spotify/spotify.query';
import { getTwitchToken } from '../apis/twitch/twitch.query';
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
        it('should return false', async () => {
            const email = 'none@nomail.com';
            const refresh = undefined;
            const result = await refreshSpotifyToken(email, refresh!);
            expect(result).toBe(false);
            await new Promise((r) => setTimeout(r, 500));
        });

        it('should return true', async () => {
            const email = 'raphael.scandella@epitech.eu';
            const tokens = await getSpotifyToken(email);
            const refresh = tokens.sRefreshToken;
            const result = await refreshSpotifyToken(email, refresh!);
            expect(result).toBe(true);
            await new Promise((r) => setTimeout(r, 4000));
        }, 5000);
    });

    describe('refreshDiscordToken', () => {
        it('should return false', async () => {
            const email = 'none@nomail.com';
            const refresh = undefined;
            const result = await refreshDiscordToken(email, refresh!);
            expect(result).toBe(false);
            await new Promise((r) => setTimeout(r, 500));
        });

        /*it('should return true', async () => {
            const email = 'raphael.scandella@epitech.eu';
            const tokens = await getDiscordToken(email);
            const refresh = tokens.dRefreshToken;
            const result = await refreshDiscordToken(email, refresh!);
            expect(result).toBe(true);
            await new Promise((r) => setTimeout(r, 4000));
        }, 5000);*/
    });

    describe('refreshTwitchToken', () => {
        it('should return false', async () => {
            const email = 'none@nomail.com';
            const refresh = undefined;
            const result = await refreshTwitchToken(email, refresh!);
            expect(result).toBe(false);
            await new Promise((r) => setTimeout(r, 500));
        });

        it('should return true', async () => {
            const email = 'raphael.scandella@epitech.eu';
            const tokens = await getTwitchToken(email);
            const refresh = tokens.tRefreshToken;
            const result = await refreshTwitchToken(email, refresh!);
            expect(result).toBe(true);
            await new Promise((r) => setTimeout(r, 5000));
        }, 6000);
    });
});
