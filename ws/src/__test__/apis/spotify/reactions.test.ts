import {
    getUserSpotifyID,
    getSongID,
    startPlaybackSong,
    skipToNextSong,
    skipToPreviousSong,
    setPlaybackVolume,
    createPlaylist,
    addItemsToPlaylist,
} from '../../../apis/spotify/reactions';
import { getSpotifyToken } from '../../../apis/spotify/spotify.query';
import axios from 'axios';
import { db, pool } from '../../../utils/database';

jest.mock('axios');
jest.mock('../../../apis/spotify/spotify.query');
jest.mock('../../../utils/refresh');

describe('Spotify Reactions API', () => {
    const mockToken = 'mockToken';
    const mockEmail = 'test@example.com';
    const mockTrack = 'testTrack';
    const mockPlaylistId = 'mockPlaylistId';
    const mockTrackUris = ['spotify:track:1', 'spotify:track:2'];

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

    it('should get user Spotify ID', async () => {
        (axios.get as jest.Mock).mockResolvedValue({ data: { id: 'userId' } });
        const userId = await getUserSpotifyID(mockToken);
        expect(userId).toBe('userId');
        await new Promise((r) => setTimeout(r, 3500));
    }, 5000);

    it('should get song ID', async () => {
        (axios.get as jest.Mock).mockResolvedValue({
            data: { tracks: { items: [{ id: 'songId' }] } },
        });
        const songId = await getSongID(mockTrack, mockToken);
        expect(songId).toBe('songId');
        await new Promise((r) => setTimeout(r, 3500));
    }, 5000);

    it('should start playback song', async () => {
        (getSpotifyToken as jest.Mock).mockResolvedValue({
            sAccessToken: mockToken,
            sRefreshToken: 'refreshToken',
        });
        (axios.get as jest.Mock).mockResolvedValue({
            data: { tracks: { items: [{ id: 'songId' }] } },
        });
        (axios.put as jest.Mock).mockResolvedValue({ status: 204 });
        const result = await startPlaybackSong(mockEmail, mockTrack);
        expect(result).toBe(true);
        await new Promise((r) => setTimeout(r, 3500));
    }, 5000);

    it('should skip to next song', async () => {
        (getSpotifyToken as jest.Mock).mockResolvedValue({
            sAccessToken: mockToken,
            sRefreshToken: 'refreshToken',
        });
        (axios.post as jest.Mock).mockResolvedValue({ status: 204 });
        const result = await skipToNextSong(mockEmail);
        expect(result).toBe(true);
        await new Promise((r) => setTimeout(r, 3500));
    }, 5000);

    it('should skip to previous song', async () => {
        (getSpotifyToken as jest.Mock).mockResolvedValue({
            sAccessToken: mockToken,
            sRefreshToken: 'refreshToken',
        });
        (axios.post as jest.Mock).mockResolvedValue({ status: 204 });
        const result = await skipToPreviousSong(mockEmail);
        expect(result).toBe(true);
        await new Promise((r) => setTimeout(r, 3500));
    }, 5000);

    it('should set playback volume', async () => {
        (getSpotifyToken as jest.Mock).mockResolvedValue({
            sAccessToken: mockToken,
            sRefreshToken: 'refreshToken',
        });
        (axios.put as jest.Mock).mockResolvedValue({ status: 204 });
        const result = await setPlaybackVolume(mockEmail, '50');
        expect(result).toBe(true);
        await new Promise((r) => setTimeout(r, 3500));
    }, 5000);

    it('should create playlist', async () => {
        (getSpotifyToken as jest.Mock).mockResolvedValue({
            sAccessToken: mockToken,
            sRefreshToken: 'refreshToken',
        });
        (axios.get as jest.Mock).mockResolvedValue({ data: { id: 'userId' } });
        (axios.post as jest.Mock).mockResolvedValue({ status: 201 });
        const result = await createPlaylist(
            mockEmail,
            'playlistName',
            'playlistDescription',
            true
        );
        expect(result).toBe(true);
        await new Promise((r) => setTimeout(r, 3500));
    }, 5000);

    it('should add items to playlist', async () => {
        (getSpotifyToken as jest.Mock).mockResolvedValue({
            sAccessToken: mockToken,
            sRefreshToken: 'refreshToken',
        });
        (axios.post as jest.Mock).mockResolvedValue({ status: 201 });
        const result = await addItemsToPlaylist(
            mockEmail,
            mockPlaylistId,
            mockTrackUris
        );
        expect(result).toBe(true);
        await new Promise((r) => setTimeout(r, 3500));
    }, 5000);
});
