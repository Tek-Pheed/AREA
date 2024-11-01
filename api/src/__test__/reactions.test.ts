import supertest from 'supertest';
import { db, pool } from '../database/db';
import createTestServer from '../utils/serverTest';
import { generateToken } from '../routes/auth/auth';
import {
    getAllReactions,
    getReactionAPI,
    getSpecificReaction,
} from '../routes/reactions/reactions.query';
import log from '../utils/logger';
require('../../node_modules/mysql2/node_modules/iconv-lite').encodingExists(
    'foo'
);

const app = createTestServer();

describe('Reactions', () => {
    beforeAll(async () => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    log.error(
                        'Erreur de connexion à la base de données MySQL :',
                        err
                    );
                    reject(err);
                } else {
                    log.info('Connexion au pool MySQL réussie.');
                    connection.release();
                    resolve(true);
                }
            });
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

        it('Get know specific api', async () => {
            await supertest(app)
                .get('/api/reactions/17')
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

        it('Get unknown specific api', async () => {
            const result = await getSpecificReaction('10000');
            expect(result).toBe(null);
        });
    });

    afterAll(async () => {
        pool.end((err) => {
            if (err) {
                log.error(
                    'Erreur lors de la fermeture du pool de connexions MySQL :',
                    err
                );
            } else {
                log.info('Pool de connexions MySQL fermé avec succès.');
                db.end();
            }
        });
    });
});
