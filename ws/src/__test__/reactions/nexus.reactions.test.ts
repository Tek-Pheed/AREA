import { IBody } from '../../utils/data.model';
import { db, pool } from '../../utils/database';
import * as reactManager from '../../core/reaction.manager';
import { nexusReactions } from '../../core/reactions/nexus.reactions';

describe('github.reactions.ts', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    afterAll(async () => {
        await new Promise<void>((resolve, reject) => {
            db.end((err) => {
                if (err) {
                    console.error('Error closing the connection:', err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        await new Promise<void>((resolve, reject) => {
            pool.end((err) => {
                if (err) {
                    console.error('Error closing pool connections:', err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    });
    describe('nexusReactions', () => {
        const email = 'test@example.com';
        const actionParam = [{ name: 'actionParam1', value: 'value1' }];

        afterEach(() => {
            jest.clearAllMocks();
            jest.resetAllMocks();
        });

        it('should call launchReaction with correct parameters', async () => {
            const reactionsList: IBody = {
                reaction: [
                    {
                        reaction: 'reaction1',
                        params: [
                            { name: 'param1', value: 'value1' },
                            { name: 'param2', value: 'value2' },
                        ],
                        name: '',
                        value: '',
                    },
                ],
                action: [],
            };
            jest.spyOn(reactManager, 'launchReaction').mockImplementation(
                jest.fn()
            );

            await nexusReactions(reactionsList, actionParam, email);

            expect(reactManager.launchReaction).toHaveBeenCalledWith(
                'reaction1',
                {
                    action: [],
                    reaction: [
                        { name: 'param1', value: 'value1' },
                        { name: 'param2', value: 'value2' },
                    ],
                },
                actionParam,
                email
            );
        }, 5000);

        it('should not call launchReaction if reaction or params are undefined', async () => {
            const reactionsList: IBody = {
                reaction: [
                    {
                        reaction: undefined,
                        params: undefined,
                        name: '',
                        value: '',
                    },
                ],
                action: [],
            };

            jest.spyOn(reactManager, 'launchReaction').mockImplementation(
                jest.fn()
            );

            await nexusReactions(reactionsList, actionParam, email);

            expect(reactManager.launchReaction).not.toHaveBeenCalled();
        }, 5000);
    });
});
