import supertest from 'supertest';
import createTestServer from '../utils/serverTest';
import { db, pool } from '../database/db';
import log from '../utils/logger';

const app = createTestServer();

describe('Download', () => {
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

    describe('return 404', () => {
        it('Get log file', async () => {
            await supertest(app).get('/api/download').expect(404);
        });
    });
});
