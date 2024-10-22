import {
    getActions,
    getReactions,
    getUsersConfigs,
} from '../query/usersConfig';
import { db, pool } from '../utils/database';
import log from '../utils/logger';

describe('usersConfig', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    beforeAll(async () => {
        await new Promise<void>((resolve, reject) => {
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
                    resolve();
                }
            });
        });
    });

    afterAll(async () => {
        // Close the single db connection
        db.end((err) => {
            if (err) {
                console.error('Error closing the connection:', err);
            }
        });

        // If using pool, end all connections
        pool.end((err) => {
            if (err) {
                console.error('Error closing pool connections:', err);
            }
        });
    });

    //getActions
    describe('getActions', () => {
        it('should return actions 13', async () => {
            const actions = await getActions('13');
            expect(actions).toEqual([
                {
                    api_name: 'Twitch',
                    description: 'When a live has a specific title',
                    id: 13,
                    input: [
                        {
                            description:
                                'Username of the user you want to check',
                            name: 'StreamUsername',
                            type: 'text',
                        },
                        {
                            description: 'Title name to compare',
                            name: 'Title Name',
                            type: 'text',
                        },
                    ],
                    labels: [
                        { name: 'Title', value: 'title' },
                        { name: 'Streamer Name', value: 'broadcaster_name' },
                    ],
                    title: 'Specific live title',
                },
            ]);
        });
    });

    //getActions null
    describe('getActions', () => {
        it('should return null', async () => {
            const actions = await getActions('1');
            expect(actions).toEqual([]);
        });
    });

    //getReactions
    describe('getReactions', () => {
        it('should return reaction 17', async () => {
            const actions = await getReactions('17');
            expect(actions).toEqual([
                {
                    api_name: 'Spotify',
                    description: 'Return to the previous song',
                    id: 17,
                    input: null,
                    title: 'Skip to previous',
                },
            ]);
        });
    });

    //getReactions null
    describe('getReactions', () => {
        it('should return null', async () => {
            const actions = await getReactions('13');
            expect(actions).toEqual([]);
        });
    });

    //getUsersConfigs
    describe('getUsersConfigs', () => {
        it('should return UsersConfigs', async () => {
            const actions = await getUsersConfigs();
            expect(actions[0]).toEqual({
                actions_id: 6,
                body: {
                    action: [{ name: 'StreamUsername', value: 'otplol_' }],
                    reaction: [{ name: 'songName', value: '{{game_name}}' }],
                },
                email: 'test@example.com',
                headers: { 'Content-Type': 'application/json' },
                id: 1,
                method: 'GET',
                reaction_id: 9,
            });
        });
    });
});
