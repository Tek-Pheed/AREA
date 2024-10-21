import { likePhotoReaction } from '../../core/reactions/unsplash.reaction';
import * as unsplashReactions from '../../apis/unsplash/reactions';
import log from '../../utils/logger';
import { IBody } from '../../utils/data.model';
import { db, pool } from '../../utils/database';

describe('Unsplash Reactions', () => {
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

    const email = 'testws@example.com';

    describe('likePhotoReaction', () => {
        it('should call likePhoto with correct parameters and log the result', async () => {
            jest.spyOn(unsplashReactions, 'likePhoto').mockImplementation(
                jest.fn()
            );

            const params: IBody = {
                action: [],
                reaction: [{ name: 'photoId', value: 'testPhotoId' }],
            };

            await likePhotoReaction(params, email);

            expect(unsplashReactions.likePhoto).toHaveBeenCalledWith(
                email,
                'testPhotoId'
            );
            await new Promise((r) => setTimeout(r, 3500));
        }, 4000);

        it('should handle errors thrown by likePhoto', async () => {
            jest.spyOn(unsplashReactions, 'likePhoto').mockImplementation(
                jest.fn()
            );
            const params: IBody = {
                action: [],
                reaction: [{ name: 'photoId', value: 'testPhotoId' }],
            };
            await expect(likePhotoReaction(params, email)).rejects.toThrow(
                'Test error'
            );
            expect(log.debug).not.toHaveBeenCalled();
            await new Promise((r) => setTimeout(r, 3500));
        }, 4000);
    });
});
