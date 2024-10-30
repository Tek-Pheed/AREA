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

    describe('return 200', () => {
        it('Get all presets', async () => {
            await supertest(app)
                .get('/api/presets/')
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
