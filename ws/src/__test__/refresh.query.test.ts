import { db, pool } from '../utils/database';
import log from '../utils/logger';

import { refreshAccessTokeninDB } from '../utils/refresh.query';

describe('refresh.query.ts', () => {
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

    describe('refreshAccessToken', () => {
        it('should return false', async () => {
            const email = 'none@nomail.com';
            const service = 'Spotify';
            const accessToken = 'dsfhsdgfjsdfs';
            const result = await refreshAccessTokeninDB(
                email,
                service,
                accessToken
            );
            expect(result).toBe(false);
        });
    });

    describe('refreshAccessToken', () => {
        it('should return true', async () => {
            const email = 'testws@example.com';
            const service = 'Spotify';
            const accessToken = 'tt';
            const result = await refreshAccessTokeninDB(
                email,
                service,
                accessToken
            );
            expect(result).toBe(true);
        });
    });
});
