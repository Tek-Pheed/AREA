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
            const email = 'none@nomail.com';
            const refresh =
                'AQBS58QXQpNxRBXbHgRwSR5CP13R9SBNOHgTRTdZn3GiGVRB1NpWmucutzpAwZ3Wyx10E-MjJH_zFW6CPE10EeBolrWbSoHJklnHtHYBPk0mCu1lKEgUf67T6kDjQevJ76s';
            const result = await refreshSpotifyToken(email, refresh!);
            expect(result).toBe(true);
            await new Promise((r) => setTimeout(r, 3500));
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

        it('should return true', async () => {
            const email = 'none@nomail.com';
            const refresh = '7nUmQsUALJTrKvV76lynb8MPbOKmbf';
            const result = await refreshDiscordToken(email, refresh!);
            expect(result).toBe(true);
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);
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
            const email = 'none@nomail.com';
            const refresh =
                'tinj1jghagujhuc28qvfwgig7xj5w0ffx2wcmwe9mi35xnhw63';
            const result = await refreshTwitchToken(email, refresh!);
            expect(result).toBe(true);
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);
    });
});
