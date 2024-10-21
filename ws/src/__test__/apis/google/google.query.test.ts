import { getGoogleToken } from '../../../apis/google/google.query';
import { db, pool } from '../../../utils/database';

describe('google.query.ts', () => {
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

    describe('getGoogleToken', () => {
        it('should return the tokens', async () => {
            const email = 'testws@example.com';
            const result = await getGoogleToken(email);
            expect(result).toStrictEqual({
                gAccessToken: 'tt',
                gRefreshToken: 'tt',
            });
        });

        it('should return false', async () => {
            const email = 'none@example.com';
            const result = await getGoogleToken(email);
            expect(result).toBe(false);
        });
    });
});
