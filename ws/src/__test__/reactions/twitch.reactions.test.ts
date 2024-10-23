import request from 'supertest';
import * as twitchReaction from '../../core/reactions/twitch.reactions';
import * as twitchReactions from '../../apis/twitch/reactions';
import log from '../../utils/logger';
import { db, pool } from '../../utils/database';

jest.mock('../../apis/twitch/reactions');
jest.mock('../../utils/logger');

describe('Twitch Reactions', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    afterAll(async () => {
        await Promise.all([
            new Promise<void>((resolve, reject) => {
                db.end((err) => {
                    if (err) {
                        console.error('Error closing the connection:', err);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }),
            new Promise<void>((resolve, reject) => {
                pool.end((err) => {
                    if (err) {
                        console.error('Error closing pool connections:', err);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }),
        ]);
    }, 30000);

    const email = 'raphael.scandella@epitech.eu';

    describe('sendMessageInStreamerChat', () => {
        it('should send a chat message', async () => {
            jest.spyOn(twitchReactions, 'sendChatMessage').mockImplementation(
                jest.fn()
            );
            const params = {
                action: [],
                reaction: [
                    { name: 'username', value: 'testuser' },
                    { name: 'message', value: 'Hello, world!' },
                ],
            };
            await twitchReaction.sendMessageInStreamerChat(params, email);

            expect(twitchReactions.sendChatMessage).toHaveBeenCalledWith(
                email,
                'testuser',
                'Hello, world!'
            );
            expect(log.debug).toHaveBeenCalledWith(undefined);
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);
    });

    describe('createClipOnStream', () => {
        it('should create a clip', async () => {
            jest.spyOn(twitchReactions, 'createClip').mockImplementation(
                jest.fn()
            );
            const params = {
                action: [],
                reaction: [{ name: 'username', value: 'testuser' }],
            };

            await twitchReaction.createClipOnStream(params, email);

            expect(twitchReactions.createClip).toHaveBeenCalledWith(
                email,
                'testuser'
            );
            expect(log.debug).toHaveBeenCalledWith(undefined);
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);
    });
});
