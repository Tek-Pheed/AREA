import { getUnsplashToken } from '../../../apis/unsplash/unsplash.query';
import { db, pool } from '../../../utils/database';

describe('spotify.query.ts', () => {
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

    describe('getUnsplashToken', () => {
        it('should return the tokens', async () => {
            const email = 'testws@example.com';
            const result = await getUnsplashToken(email);
            expect(result).toStrictEqual('tt');
        });

        it('should return false', async () => {
            const email = 'none@example.com';
            const result = await getUnsplashToken(email);
            expect(result).toBe(false);
        });
    });
});
