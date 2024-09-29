import supertest from 'supertest';
import { db, pool } from '../database/db';
import createTestServer from '../utils/serverTest';
import { generateToken } from '../routes/auth/auth';
require('../../node_modules/mysql2/node_modules/iconv-lite').encodingExists(
    'foo'
);

const app = createTestServer();

describe('users', () => {
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

    describe('return 500', () => {
        it('Token missing', async () => {
            await supertest(app).get(`/api/users/me`).expect(500);
        });

        it("Current user isn't know", async () => {
            await supertest(app)
                .get(`/api/users/me`)
                .set(
                    'Authorization',
                    `Bearer ${generateToken('abcpdf@gmail.com')}`
                )
                .expect(500);
        });

        it('Token is incorrect', async () => {
            await supertest(app)
                .get(`/api/users/me`)
                .set('Authorization', `Bearer abc`)
                .expect(500);
        });
    });

    describe('return 200', () => {
        it('Current user is know', async () => {
            await supertest(app)
                .get(`/api/users/me`)
                .set(
                    'Authorization',
                    `Bearer ${generateToken('test@example.com')}`
                )
                .expect(200);
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
