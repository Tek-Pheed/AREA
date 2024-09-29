import supertest from 'supertest';
import { db, pool } from '../database/db';
import createTestServer from '../utils/serverTest';
import { generateToken } from '../routes/auth/auth';
require('../../node_modules/mysql2/node_modules/iconv-lite').encodingExists(
    'foo'
);

const app = createTestServer();

describe('actions', () => {
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

        it('Get all actions api', async () => {
            await supertest(app)
                .get('/api/actions/api')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
        });
    });

    describe('return 500', () => {});

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
