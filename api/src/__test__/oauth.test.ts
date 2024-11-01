import supertest from 'supertest';
import { db, pool } from '../database/db';
import createTestServer from '../utils/serverTest';
import log from '../utils/logger';
import { generateToken } from '../routes/auth/auth';
import {
    getAllConnections,
    insertTokeninDb,
    logoutService,
} from '../routes/oauth/oauth.query';
import exp = require('node:constants');
require('../../node_modules/mysql2/node_modules/iconv-lite').encodingExists(
    'foo'
);

const app = createTestServer();

const token = generateToken('test@example.com');

describe('OAuth', () => {
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

    describe('return 302', () => {
        it('Spotify login route with email', async () => {
            await supertest(app)
                .get('/api/oauth/spotify/login/test@example.com')
                .expect(302);
        });

        it('Spotify login route without email', async () => {
            await supertest(app).get('/api/oauth/spotify/login').expect(302);
        });

        it('Spotify callback', async () => {
            await supertest(app).get('/api/oauth/spotify/callback').expect(302);
        });

        it('Google login route with email', async () => {
            await supertest(app)
                .get('/api/oauth/google/login/test@example.com')
                .expect(302);
        });

        it('Google login route without email', async () => {
            await supertest(app).get('/api/oauth/google/login').expect(302);
        });

        it('Google callback', async () => {
            await supertest(app).get('/api/oauth/google/callback').expect(302);
        });

        it('Twitch login route with email', async () => {
            await supertest(app)
                .get('/api/oauth/twitch/login/test@example.com')
                .expect(302);
        });

        it('Twitch login route without email', async () => {
            await supertest(app).get('/api/oauth/twitch/login').expect(302);
        });

        it('Twitch callback', async () => {
            await supertest(app).get('/api/oauth/twitch/callback').expect(302);
        });

        it('Unsplash login route with email', async () => {
            await supertest(app)
                .get('/api/oauth/unsplash/login/test@example.com')
                .expect(302);
        });

        it('Unsplash login route without email', async () => {
            await supertest(app).get('/api/oauth/unsplash/login').expect(302);
        });

        it('Unsplash callback', async () => {
            await supertest(app)
                .get('/api/oauth/unsplash/callback')
                .expect(302);
        });

        it('Discord login route with email', async () => {
            await supertest(app)
                .get('/api/oauth/discord/login/test@example.com')
                .expect(302);
        });

        it('Discord callback', async () => {
            await supertest(app).get('/api/oauth/discord/callback').expect(302);
        });

        it('Discord login route without email', async () => {
            await supertest(app).get('/api/oauth/discord/login').expect(302);
        });

        it('Github login route with email', async () => {
            await supertest(app)
                .get('/api/oauth/github/login/test@example.com')
                .expect(302);
        });

        it('Github login route without email', async () => {
            await supertest(app).get('/api/oauth/github/login').expect(302);
        });

        it('Github callback', async () => {
            await supertest(app).get('/api/oauth/github/callback').expect(302);
        });
    });

    describe('return null', () => {
        it('getAllConnections when token is null', async () => {
            const result = await getAllConnections('');
            expect(result).toBeNull();
        });

        it('getAllConnections when db KO', async () => {
            db.end();
            const result = await getAllConnections(
                generateToken('test@example.com')
            );
            expect(result).toBeNull();
        });

        it('logoutService when db KO', async () => {
            db.end();
            const result = await logoutService('test@example.com', 'spotify');
            expect(result).toBeNull();
        });

        it('logoutService when db KO', async () => {
            const result = await logoutService('test@example.com', 'spotify');
            expect(result).toBeNull();
        });

        it('insertTokeninDb when refresh_token is null', async () => {
            const result = await insertTokeninDb('spotify', '', null, '');
            expect(result).toBeUndefined();
        });

        it('insertTokeninDb when refresh_token is ok', async () => {
            const result = await insertTokeninDb('spotify', '', '', '');
            expect(result).toBeUndefined();
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
