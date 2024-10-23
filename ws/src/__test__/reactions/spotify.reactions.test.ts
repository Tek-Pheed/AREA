import {
    startSpecificMusic,
    skipToPreviousMusic,
    skipToNextMusic,
} from '../../core/reactions/spotify.reactions';
import * as spotifyReactions from '../../apis/spotify/reactions';
import {
    startPlaybackSong,
    skipToPreviousSong,
    skipToNextSong,
} from '../../apis/spotify/reactions';
import log from '../../utils/logger';
import { IBody } from '../../utils/data.model';
import { db, pool } from '../../utils/database';

describe('Spotify Reactions', () => {
    const email = 'raphael.scandella@epitech.eu';
    jest.mock('../../apis/spotify/reactions');
    jest.mock('../../utils/logger');

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

    describe('startSpecificMusic', () => {
        it('should call startPlaybackSong with correct parameters', async () => {
            jest.spyOn(
                spotifyReactions,
                'startPlaybackSong'
            ).mockImplementation(jest.fn());
            const params: IBody = {
                action: [],
                reaction: [{ name: 'songName', value: 'testSong' }],
            };
            await startSpecificMusic(params, email);

            expect(startPlaybackSong).toHaveBeenCalledWith(email, 'testSong');
            expect(log.debug).toHaveBeenCalled();
        }, 5000);

        it('should not call startPlaybackSong if songName is not present', async () => {
            jest.spyOn(
                spotifyReactions,
                'startPlaybackSong'
            ).mockImplementation(jest.fn());
            const params: IBody = {
                action: [],
                reaction: [{ name: 'artistName', value: 'testArtist' }],
            };

            await startSpecificMusic(params, email);

            expect(startPlaybackSong).not.toHaveBeenCalled();
            expect(log.debug).not.toHaveBeenCalled();
        }, 5000);
    });

    describe('skipToPreviousMusic', () => {
        it('should call skipToPreviousSong and log the result', async () => {
            jest.spyOn(
                spotifyReactions,
                'skipToPreviousSong'
            ).mockImplementation(jest.fn());
            await skipToPreviousMusic(email);

            expect(skipToPreviousSong).toHaveBeenCalledWith(email);
            expect(log.debug).toHaveBeenCalled();
        }, 5000);
    });

    describe('skipToNextMusic', () => {
        it('should call skipToNextSong and log the result', async () => {
            jest.spyOn(spotifyReactions, 'skipToNextSong').mockImplementation(
                jest.fn()
            );
            await skipToNextMusic(email);

            expect(skipToNextSong).toHaveBeenCalledWith(email);
            expect(log.debug).toHaveBeenCalled();
        }, 5000);
    });
});
