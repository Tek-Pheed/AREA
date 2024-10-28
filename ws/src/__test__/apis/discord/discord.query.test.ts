import { getDiscordToken } from '../../../apis/discord/discord.query';
import { db, pool } from '../../../utils/database';

describe('discord.query.ts', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

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

    describe('getDiscordToken', () => {
        it('should return the tokens', async () => {
            const email = 'testws@example.com';
            const result = await getDiscordToken(email);
            expect(result).toStrictEqual({
                dAccessToken: 'tt',
                dRefreshToken: 'tt',
            });
        });

        it('should return false', async () => {
            const email = 'none@example.com';
            const result = await getDiscordToken(email);
            expect(result).toBe(false);
        });
    });
});
