import request from 'supertest';
import { getUserLastPictures } from '../../../apis/unsplash/actions';
import { getUnsplashToken } from '../../../apis/unsplash/unsplash.query';
import axios from 'axios';
import log from '../../../utils/logger';
import { db, pool } from '../../../utils/database';

jest.mock('axios');
jest.mock('../../../apis/unsplash/unsplash.query');
jest.mock('../../../utils/logger');

describe('getUserLastPictures', () => {
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

    const email = 'test@example.com';
    const username = 'testuser';
    const token = 'mockToken';
    const mockResponse = {
        data: [
            {
                id: '1',
                urls: { raw: 'http://example.com/photo.jpg' },
                likes: 10,
            },
        ],
    };

    it('should return user last pictures when API call is successful', async () => {
        (getUnsplashToken as jest.Mock).mockResolvedValue(token);
        (axios.get as jest.Mock).mockResolvedValue(mockResponse);

        const result = await getUserLastPictures(email, username);

        expect(getUnsplashToken).toHaveBeenCalledWith(email);
        expect(axios.get).toHaveBeenCalledWith(
            `https://api.unsplash.com/users/${username}/photos`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        expect(result).toEqual([
            { name: 'id', value: '1' },
            { name: 'link', value: 'http://example.com/photo.jpg' },
            { name: 'likes', value: 10 },
        ]);
        await new Promise((r) => setTimeout(r, 3500));
    }, 5000);

    it('should return null and log error when API call fails', async () => {
        const error = new Error('API call failed');
        (getUnsplashToken as jest.Mock).mockResolvedValue(token);
        (axios.get as jest.Mock).mockRejectedValue(error);

        const result = await getUserLastPictures(email, username);

        expect(getUnsplashToken).toHaveBeenCalledWith(email);
        expect(axios.get).toHaveBeenCalledWith(
            `https://api.unsplash.com/users/${username}/photos`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        expect(log.error).toHaveBeenCalledWith(
            `email:${email} service:Unsplash Error fetching photos of user ${error}`
        );
        expect(result).toBeNull();
        await new Promise((r) => setTimeout(r, 3500));
    }, 5000);
});
