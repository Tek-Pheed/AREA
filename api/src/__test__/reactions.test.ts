import supertest from 'supertest';
import { db, pool } from '../database/db';
import createTestServer from '../utils/serverTest';
import { generateToken } from '../routes/auth/auth';
import { beforeEach } from 'node:test';
import { getAllActions } from '../routes/actions/action.query';
import {
    getAllReactions,
    getReactionAPI,
} from '../routes/reactions/reactions.query';
require('../../node_modules/mysql2/node_modules/iconv-lite').encodingExists(
    'foo'
);

const app = createTestServer();

describe('reactions', () => {
    beforeAll(async () => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error(
                    'Erreur de connexion à la base de données MySQL :',
                    err
                );
                process.exit(1);
            } else {
                console.log('Connexion au pool MySQL réussie.');
                connection.release();
            }
        });
    });

    describe('return 401', () => {
        it('Get all reactions (authorization denied)', async () => {
            await supertest(app).get('/api/reactions/').expect(401);
        });

        it('Get all reactions api (authorization denied)', async () => {
            await supertest(app).get('/api/reactions/api').expect(401);
        });

        it('bad credentials', async () => {
            await supertest(app)
                .get('/api/reactions')
                .set('Authorization', `Bearer abcd`)
                .expect(401);
        });
    });

    describe('return 200', () => {
        const token = generateToken('test@example.com');
        it('Get all reactions', async () => {
            await supertest(app)
                .get('/api/reactions/')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
        });

        it('Get all reactions api', async () => {
            await supertest(app)
                .get('/api/reactions/api')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
        });
    });

    describe('return 500', () => {
        it('Error when call reactions function', async () => {
            db.end();
            const result = await getAllReactions();
            expect(result).toBe(null);
        });

        it('Error when call reactions function api', async () => {
            db.end();
            const result = await getReactionAPI();
            expect(result).toBe(null);
        });
    });

    afterAll(async () => {
        pool.end((err) => {
            if (err) {
                console.error(
                    'Erreur lors de la fermeture du pool de connexions MySQL :',
                    err
                );
            } else {
                console.log('Pool de connexions MySQL fermé avec succès.');
                db.end();
            }
        });
    });
});
