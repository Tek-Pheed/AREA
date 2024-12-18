import supertest from 'supertest';
import { db, pool } from '../database/db';
import createTestServer from '../utils/serverTest';
import { generateToken } from '../routes/auth/auth';
import {
    getActionsAPI,
    getAllActions,
    getSpecificAction,
} from '../routes/actions/action.query';
import {
    getAllReactions,
    getReactionAPI,
} from '../routes/reactions/reactions.query';
import log from '../utils/logger';
require('../../node_modules/mysql2/node_modules/iconv-lite').encodingExists(
    'foo'
);

const app = createTestServer();

describe('Actions', () => {
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
        it('Get all actions (authorization denied)', async () => {
            await supertest(app).get('/api/actions/').expect(401);
        });

        it('Get all actions api (authorization denied)', async () => {
            await supertest(app).get('/api/actions/api').expect(401);
        });

        it('bad credentials', async () => {
            await supertest(app)
                .get('/api/actions')
                .set('Authorization', `Bearer abcd`)
                .expect(401);
        });

        it('Token (user) not exist', async () => {
            await supertest(app)
                .get(`/api/actions`)
                .set(
                    'Authorization',
                    `Bearer ${generateToken('tsest@example.com')}`
                )
                .expect(401);
        });
    });

    describe('return 200', () => {
        const token = generateToken('test@example.com');
        it('Get all actions', async () => {
            await supertest(app)
                .get('/api/actions/')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
        });

        it('Get specific action', async () => {
            await supertest(app)
                .get('/api/actions/15')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
        });

        it('Get all actions api', async () => {
            await supertest(app)
                .get('/api/actions/api')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
        });
    });

    describe('return 500', () => {
        it("Error when call specific action function doesn't exist", async () => {
            const result = await getSpecificAction('0');
            expect(result).toBe(null);
        });

        it('Error when call action function', async () => {
            db.end();
            const result = await getAllActions();
            expect(result).toBe(null);
        });

        it('Error when call specific action function', async () => {
            const result = await getSpecificAction('0');
            expect(result).toBe(null);
        });

        it('Error when call action function api', async () => {
            db.end();
            const result = await getActionsAPI();
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
