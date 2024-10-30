import request from 'supertest';
import {
    whenListenSpecificSong,
    whenListenSpecificSound,
    whenListen,
} from '../../core/actions/spotify.actions';
import { isPlaying, getSpecificSong } from '../../apis/spotify/actions';
import { launchReaction } from '../../core/reaction.manager';
import { IBody } from '../../utils/data.model';

jest.mock('../../apis/spotify/actions');
jest.mock('../../core/reaction.manager');

describe('Spotify Actions', () => {
    const email = 'test@example.com';
    const reaction = [{ title: 'Test Reaction' }];
    const params: IBody = {
        action: [{ name: 'songName', value: 'Test Song' }],
        reaction: [{ name: 'reactionName', value: 'reactionValue' }],
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('whenListenSpecificSong', () => {
        it('should launch reaction if song is playing', async () => {
            (isPlaying as jest.Mock).mockResolvedValue([
                { label: 'Test Label' },
            ]);

            await whenListenSpecificSong(params, email, reaction);

            expect(isPlaying).toHaveBeenCalledWith(email);
            expect(launchReaction).toHaveBeenCalledWith(
                reaction[0].title,
                params,
                [{ label: 'Test Label' }],
                email
            );
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);

        it('should not launch reaction if song is not playing', async () => {
            (isPlaying as jest.Mock).mockResolvedValue(false);

            await whenListenSpecificSong(params, email, reaction);

            expect(isPlaying).toHaveBeenCalledWith(email);
            expect(launchReaction).not.toHaveBeenCalled();
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);
    });

    describe('whenListenSpecificSound', () => {
        it('should launch reaction if specific song is found', async () => {
            (getSpecificSong as jest.Mock).mockResolvedValue([
                { label: 'Test Label' },
            ]);

            await whenListenSpecificSound(params, email, reaction);

            expect(getSpecificSong).toHaveBeenCalledWith(email, 'Test Song');
            expect(launchReaction).toHaveBeenCalledWith(
                reaction[0].title,
                params,
                [{ label: 'Test Label' }],
                email
            );
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);

        it('should not launch reaction if specific song is not found', async () => {
            (getSpecificSong as jest.Mock).mockResolvedValue(false);

            await whenListenSpecificSound(params, email, reaction);

            expect(getSpecificSong).toHaveBeenCalledWith(email, 'Test Song');
            expect(launchReaction).not.toHaveBeenCalled();
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);
    });

    describe('whenListen', () => {
        it('should launch reaction if song is playing', async () => {
            (isPlaying as jest.Mock).mockResolvedValue([
                { label: 'Test Label' },
            ]);

            await whenListen(params, email, reaction);

            expect(isPlaying).toHaveBeenCalledWith(email);
            expect(launchReaction).toHaveBeenCalledWith(
                reaction[0].title,
                params,
                [{ label: 'Test Label' }],
                email
            );
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);

        it('should not launch reaction if song is not playing', async () => {
            (isPlaying as jest.Mock).mockResolvedValue(false);

            await whenListen(params, email, reaction);

            expect(isPlaying).toHaveBeenCalledWith(email);
            expect(launchReaction).not.toHaveBeenCalled();
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);
    });
});
