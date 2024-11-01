import supertest from 'supertest';
import { db, pool } from '../database/db';
import createTestServer from '../utils/serverTest';
import log from '../utils/logger';
import { getJsonAbout } from '../routes/about/about.query';
import { generateToken } from '../routes/auth/auth';
require('../../node_modules/mysql2/node_modules/iconv-lite').encodingExists(
    'foo'
);

const app = createTestServer();

describe('Logger', () => {
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

    describe('return 500', () => {
        it('Get log file', async () => {
            await supertest(app)
                .get('/api/logs/test@example.com/spotify')
                .set(
                    'Authorization',
                    `Bearer ${generateToken('test@example.com')}`
                )
                .expect(500);
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
