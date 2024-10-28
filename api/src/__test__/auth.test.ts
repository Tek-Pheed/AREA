import supertest from 'supertest';
import { db, pool } from '../database/db';
import createTestServer from '../utils/serverTest';
import log from '../utils/logger';
import { login } from '../routes/auth/auth.query';
require('../../node_modules/mysql2/node_modules/iconv-lite').encodingExists(
    'foo'
);

const app = createTestServer();

describe('auth', () => {
    beforeAll(async () => {
        pool.getConnection((err, connection) => {
            if (err) {
                log.error(
                    'Erreur de connexion à la base de données MySQL :',
                    err
                );
                process.exit(1);
            } else {
                log.info('Connexion au pool MySQL réussie.');
                connection.release();
            }
        });
    });

    describe('return 400', () => {
        it('Login information was missing', async () => {
            await supertest(app).post(`/api/auth/login`).expect(400);
        });

        it('Register information was missing', async () => {
            await supertest(app).post(`/api/auth/register`).expect(400);
        });
    });

    describe('return 401', () => {
        it('Login information was incorrect', async () => {
            await supertest(app)
                .post(`/api/auth/login`)
                .send({ email: 'test@test.com', password: 'a' })
                .expect(401);
        });
    });

    describe('return 200', () => {
        it('Login information was correct', async () => {
            await supertest(app)
                .post(`/api/auth/login`)
                .send({
                    email: 'test@example.com',
                    password: 'test',
                })
                .expect(200);
        });
    });

    describe('return 500', () => {
        it('User is already register', async () => {
            await supertest(app)
                .post(`/api/auth/register`)
                .send({
                    email: 'test@example.com',
                    password: 'test',
                    username: 'uygfeuysf',
                })
                .expect(500);
        });

        it('New user with username already registed', async () => {
            await supertest(app)
                .post(`/api/auth/register`)
                .send({
                    email: 'test@test.com',
                    password: 'test',
                    username: 'alex.rcrd',
                })
                .expect(500);
        });

        it('New user with email already registed', async () => {
            await supertest(app)
                .post(`/api/auth/register`)
                .send({
                    email: 'test@example.com',
                    password: 'test',
                    username: 'Hello world',
                })
                .expect(500);
        });

        it('Login with wrong credentials', async () => {
            const result = await login('', '');
            expect(result).toBe(false);
        });

        it('Login with good credentials but db not responding', async () => {
            db.end();
            const result = await login('test@example.com', 'test');
            expect(result).toBe(false);
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
