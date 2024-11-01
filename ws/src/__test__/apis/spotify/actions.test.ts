import {
    getSongURL,
    isPlaying,
    getSpecificSong,
} from '../../../apis/spotify/actions';
import { getSpotifyToken } from '../../../apis/spotify/spotify.query';
import { db, pool } from '../../../utils/database';
import { refreshSpotifyToken } from '../../../utils/refresh';
import axios from 'axios';

jest.mock('axios', () => ({
    get: jest.fn(),
}));
jest.mock('../../../apis/spotify/spotify.query', () => ({
    getSpotifyToken: jest.fn().mockResolvedValue({
        sAccessToken: 'testAccessToken',
        sRefreshToken: 'testRefreshToken',
    }),
}));
jest.mock('../../../utils/refresh');
jest.mock('../../../utils/logger');

describe('Spotify Actions', () => {
    const email = 'test@example.com';
    const accessToken = 'testAccessToken';
    const refreshToken = 'testRefreshToken';

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

    describe('getSongURL', () => {
        it('should return song URL if API call is successful', async () => {
            const songName = 'testSong';
            const response = {
                data: {
                    tracks: {
                        items: [
                            {
                                external_urls: {
                                    spotify: 'https://spotify.com/testSong',
                                },
                            },
                        ],
                    },
                },
            };
            (axios.get as jest.Mock).mockResolvedValue(response);

            const result = await getSongURL(
                songName,
                accessToken,
                refreshToken,
                email
            );

            expect(result).toBe('https://spotify.com/testSong');
        });

        it('should return false and refresh token if API call fails', async () => {
            (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));

            const result = await getSongURL(
                'testSong',
                accessToken,
                refreshToken,
                email
            );

            expect(result).toBe(false);
            expect(refreshSpotifyToken).toHaveBeenCalledWith(
                email,
                refreshToken
            );
        });
    });

    describe('isPlaying', () => {
        it('should return song details if user is playing a song', async () => {
            const response = {
                data: {
                    item: {
                        artists: [{ name: 'testArtist' }],
                        name: 'testSong',
                    },
                },
            };
            (axios.get as jest.Mock).mockResolvedValue(response);
            (getSpotifyToken as jest.Mock).mockResolvedValue({
                sAccessToken: accessToken,
                sRefreshToken: refreshToken,
            });

            const result = await isPlaying(email);

            expect(result).toEqual([
                { name: 'artistsName', value: 'testArtist' },
                { name: 'songName', value: 'testSong' },
            ]);
        });

        it('should return false if API call fails', async () => {
            (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));
            (getSpotifyToken as jest.Mock).mockResolvedValue({
                sAccessToken: accessToken,
                sRefreshToken: refreshToken,
            });

            const result = await isPlaying(email);

            expect(result).toBe(false);
            expect(refreshSpotifyToken).toHaveBeenCalledWith(
                email,
                refreshToken
            );
        });
    });

    describe('getSpecificSong', () => {
        it('should return song details if the specific song is playing', async () => {
            const targetSong = 'testSong';
            const songURL = 'https://spotify.com/testSong';
            const response = {
                data: {
                    item: {
                        external_urls: { spotify: songURL },
                        artists: [{ name: 'testArtist' }],
                        name: 'testSong',
                    },
                },
            };
            (getSpotifyToken as jest.Mock).mockResolvedValue({
                sAccessToken: accessToken,
                sRefreshToken: refreshToken,
            });
            (axios.get as jest.Mock).mockResolvedValueOnce({
                data: {
                    tracks: {
                        items: [{ external_urls: { spotify: songURL } }],
                    },
                },
            });
            (axios.get as jest.Mock).mockResolvedValueOnce(response);

            const result = await getSpecificSong(email, targetSong);

            expect(result).toEqual([
                { name: 'artistsName', value: 'testArtist' },
                { name: 'songName', value: 'testSong' },
            ]);
        });

        it('should return false if the specific song is not playing', async () => {
            const targetSong = 'testSong';
            const songURL = 'https://spotify.com/testSong';
            const response = {
                data: {
                    item: {
                        external_urls: {
                            spotify: 'https://spotify.com/anotherSong',
                        },
                    },
                },
            };
            (getSpotifyToken as jest.Mock).mockResolvedValue({
                sAccessToken: accessToken,
                sRefreshToken: refreshToken,
            });
            (axios.get as jest.Mock).mockResolvedValueOnce({
                data: {
                    tracks: {
                        items: [{ external_urls: { spotify: songURL } }],
                    },
                },
            });
            (axios.get as jest.Mock).mockResolvedValueOnce(response);

            const result = await getSpecificSong(email, targetSong);

            expect(result).toBe(false);
        });

        it('should return false and refresh token if API call fails', async () => {
            const targetSong = 'testSong';
            (getSpotifyToken as jest.Mock).mockResolvedValue({
                sAccessToken: accessToken,
                sRefreshToken: refreshToken,
            });
            (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));

            const result = await getSpecificSong(email, targetSong);

            expect(result).toBe(false);
            expect(refreshSpotifyToken).toHaveBeenCalledWith(
                email,
                refreshToken
            );
        });
    });
});
