import request from 'supertest';
import { likePhoto } from '../../../apis/unsplash/reactions';
import { getUnsplashToken } from '../../../apis/unsplash/unsplash.query';
import axios from 'axios';
import { db, pool } from '../../../utils/database';

jest.mock('axios');
jest.mock('../../../apis/unsplash/unsplash.query');

describe('likePhoto', () => {
    const email = 'test@example.com';
    const photo_id = '12345';
    const token = 'mockToken';

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

    it('should like a photo successfully', async () => {
        (getUnsplashToken as jest.Mock).mockResolvedValue(token);
        (axios.post as jest.Mock).mockResolvedValue({ data: true });

        const result = await likePhoto(email, photo_id);

        expect(getUnsplashToken).toHaveBeenCalledWith(email);
        expect(axios.post).toHaveBeenCalledWith(
            `https://api.unsplash.com/photos/${photo_id}/like`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        expect(result).toBe(true);
        await new Promise((r) => setTimeout(r, 3500));
    }, 5000);

    it('should return false if liking a photo fails', async () => {
        (getUnsplashToken as jest.Mock).mockResolvedValue(token);
        (axios.post as jest.Mock).mockRejectedValue(
            new Error('Failed to like photo')
        );

        const result = await likePhoto(email, photo_id);

        expect(getUnsplashToken).toHaveBeenCalledWith(email);
        expect(axios.post).toHaveBeenCalledWith(
            `https://api.unsplash.com/photos/${photo_id}/like`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        expect(result).toBe(false);
        await new Promise((r) => setTimeout(r, 3500));
    }, 5000);
});
