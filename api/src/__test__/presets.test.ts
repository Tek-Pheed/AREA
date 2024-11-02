import supertest from 'supertest';
import { db, pool } from '../database/db';
import createTestServer from '../utils/serverTest';
import log from '../utils/logger';
import { generateToken } from '../routes/auth/auth';
import { getPresetsConfigs } from '../routes/presets/presets.query';
require('../../node_modules/mysql2/node_modules/iconv-lite').encodingExists(
    'foo'
);

const app = createTestServer();

const token = generateToken('test@example.com');

describe('Presets', () => {
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

    describe('return 200', () => {
        it('Get all presets', async () => {
            await supertest(app)
                .get('/api/presets/')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
        });
    });

    describe('return 500', () => {
        it('Get all presets when db KO', async () => {
            db.end();
            const result = await getPresetsConfigs();
            expect(result.length).toBe(0);
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
