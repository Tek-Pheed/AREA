import supertest from 'supertest';
import createTestServer from '../utils/serverTest';

const app = createTestServer();

describe('Download', () => {
    describe('return 404', () => {
        it('Get log file', async () => {
            await supertest(app).get('/api/download').expect(404);
        });
    });
});
