import supertest from 'supertest';
import { db, pool } from '../database/db';
import createTestServer from '../utils/serverTest';
import log from '../utils/logger';
import { generateToken } from '../routes/auth/auth';
require('../../node_modules/mysql2/node_modules/iconv-lite').encodingExists(
    'foo'
);

const app = createTestServer();

const token = generateToken('test@example.com');

describe('actions', () => {
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

    describe('return 401', () => {});

    describe('return 200', () => {
        it('Get all connections for one users', async () => {
            await supertest(app)
                .get('/api/oauth/connections')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
        });

        it('Update connections for one users', async () => {
            await supertest(app)
                .post('/api/oauth/update/test@example.com')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    github: {
                        access_token: undefined,
                        refresh_token: undefined,
                    },
                    twitch: {
                        access_token: undefined,
                        refresh_token: undefined,
                    },
                    discord: {
                        access_token: undefined,
                        refresh_token: undefined,
                    },
                    spotify: {
                        access_token: undefined,
                        refresh_token: undefined,
                    },
                    google: {
                        access_token: undefined,
                        refresh_token: undefined,
                    },
                    unsplash: {
                        access_token: undefined,
                        refresh_token: undefined,
                    },
                })
                .expect(200);
        });

        it('Update all connections for one users', async () => {
            await supertest(app)
                .post('/api/oauth/update/test@example.com')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    github: {
                        access_token: 'tt',
                        refresh_token: 'tt',
                    },
                    twitch: {
                        access_token: 'tt',
                        refresh_token: 'tt',
                    },
                    discord: {
                        access_token: 'tt',
                        refresh_token: 'tt',
                    },
                    spotify: {
                        access_token: 'tt',
                        refresh_token: 'tt',
                    },
                    google: {
                        access_token: 'tt',
                        refresh_token: 'tt',
                    },
                    unsplash: {
                        access_token: 'tt',
                        refresh_token: 'tt',
                    },
                })
                .expect(200);
        });

        it('Logout connection for one users', async () => {
            await supertest(app)
                .delete('/api/oauth/logout/github/test@example.com')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
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
