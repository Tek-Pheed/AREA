import { getSpotifyToken } from '../../../apis/spotify/spotify.query';
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

    describe('getSpotifyToken', () => {
        it('should return the tokens', async () => {
            const email = 'testws@example.com';
            const result = await getSpotifyToken(email);
            expect(result).toStrictEqual({
                sAccessToken: 'tt',
                sRefreshToken: null,
            });
        });

        it('should return false', async () => {
            const email = 'none@example.com';
            const result = await getSpotifyToken(email);
            expect(result).toBe(false);
        });
    });
});
