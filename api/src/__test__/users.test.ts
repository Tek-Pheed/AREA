import supertest from 'supertest';
import { Request } from 'express';
import { db, pool } from '../database/db';
import createTestServer from '../utils/serverTest';
import { generateToken } from '../routes/auth/auth';
import { getCurrentUser, updateCurrentUser } from '../routes/user/user.query';
import {
    createUserConfig,
    getAllUserConfigs,
    removeUserConfig,
} from '../routes/user/configs/configs.query';
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

    describe('configs', () => {
        describe('return 200', () => {
            it('Get all user configs', async () => {
                await supertest(app)
                    .get(`/api/users/configs/`)
                    .set(
                        'Authorization',
                        `Bearer ${generateToken('alexandre.ricard@epitech.eu')}`
                    )
                    .expect(200);
            });

            it('Create user config', async () => {
                await supertest(app)
                    .post('/api/users/configs')
                    .send({
                        actions_id: 1,
                        method: 'GET',
                        headers: 'json',
                        body: 'json',
                        reaction_id: 1,
                    })
                    .set(
                        'Authorization',
                        `Bearer ${generateToken('test@example.com')}`
                    )
                    .expect(200);
            });

            it('Update user config', async () => {
                await supertest(app)
                    .put(`/api/users/configs/8`)
                    .send({
                        actions_id: 1,
                        method: 'GET',
                        headers: 'json',
                        body: 'json',
                        reactions_id: 1,
                    })
                    .set(
                        'Authorization',
                        `Bearer ${generateToken('test@example.com')}`
                    )
                    .expect(200);
            });

            it('Delete user config', async () => {
                await supertest(app)
                    .delete(`/api/users/configs/8`)
                    .set(
                        'Authorization',
                        `Bearer ${generateToken('test@example.com')}`
                    )
                    .expect(200);
            });
        });

        describe('return 500', () => {
            it('Update user config', async () => {
                await supertest(app)
                    .put('/api/users/configs/8')
                    .set(
                        'Authorization',
                        `Bearer ${generateToken('test@example.com')}`
                    )
                    .expect(500);
            });

            it('Create config without token', async () => {
                const result = await createUserConfig(null, '');
                expect(result).toBe(null);
            });

            it('Get config without token', async () => {
                const result = await getAllUserConfigs('');
                expect(result).toBe(null);
            });

            it('Remove config without token', async () => {
                const result = await removeUserConfig('0', '');
                expect(result).toBe(false);
            });
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

        it('Update current know user', async () => {
            await supertest(app)
                .put(`/api/users/me`)
                .set(
                    'Authorization',
                    `Bearer ${generateToken('test@example.com')}`
                )
                .send({
                    username: 'test',
                    email: 'test@example.com',
                })
                .expect(200);
        });

        it('Update current know user and his password', async () => {
            await supertest(app)
                .put(`/api/users/me`)
                .set(
                    'Authorization',
                    `Bearer ${generateToken('test@example.com')}`
                )
                .send({
                    username: 'test',
                    email: 'test@example.com',
                    password: 'test',
                })
                .expect(200);
        });
    });

    describe('return 401', () => {
        it('Token missing', async () => {
            await supertest(app).get(`/api/users/me`).expect(401);
        });

        it("Current user isn't know", async () => {
            await supertest(app)
                .get(`/api/users/me`)
                .set(
                    'Authorization',
                    `Bearer ${generateToken('abcpdf@gmail.com')}`
                )
                .expect(401);
        });

        it('Token is incorrect', async () => {
            await supertest(app)
                .get(`/api/users/me`)
                .set('Authorization', `Bearer abc`)
                .expect(401);
        });
    });

    describe('return 500', () => {
        it('Update current user without token', async () => {
            const result = await updateCurrentUser('', null);
            expect(result).toBe(false);
        });

        it('Get current user without token', async () => {
            const result = await getCurrentUser('');
            expect(result).toBe(null);
        });

        it('Get current unknown user', async () => {
            const result = await updateCurrentUser(
                `${generateToken('abcd@gmail.com')}`,
                null
            );
            expect(result).toBe(false);
        });

        it('Get current unknown user', async () => {
            const result = await getCurrentUser(
                `${generateToken('abcd@gmail.com')}`
            );
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
