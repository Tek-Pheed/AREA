import { getGithubToken } from '../../../apis/github/github.query';
import { db, pool } from '../../../utils/database';

describe('github.query.ts', () => {
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

    describe('getGithubToken', () => {
        it('should return the tokens', async () => {
            const email = 'testws@example.com';
            const result = await getGithubToken(email);
            expect(result).toStrictEqual({
                gAccessToken: null,
                gRefreshToken: null,
            });
        });

        it('should return false', async () => {
            const email = 'none@example.com';
            const result = await getGithubToken(email);
            expect(result).toBe(false);
        });
    });
});
