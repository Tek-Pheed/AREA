import {
    liveStart,
    getCurrentGameOfStreamer,
    getSpecificTitle,
    getMostViewedCategory,
} from '../../core/actions/twitch.actions';
import { createVariable, readValue, setItem } from '../../utils/storage';
import { launchReaction } from '../../core/reaction.manager';
import {
    getCurrentGame,
    getCurrentTitle,
    getStreamerStatus,
    getTopGame,
} from '../../apis/twitch/actions';
import { IBody } from '../../utils/data.model';

jest.mock('../../utils/storage');
jest.mock('../../core/reaction.manager');
jest.mock('../../apis/twitch/actions');

describe('Twitch Actions', () => {
    const email = 'test@example.com';
    const reaction = [{ title: 'Test Reaction' }];
    const params: IBody = {
        action: [{ name: 'StreamUsername', value: 'testuser' }],
        reaction: [{ name: 'reactionName', value: 'reactionValue' }],
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('liveStart', () => {
        it('should set stream status and launch reaction if streamer is live', async () => {
            (getStreamerStatus as jest.Mock).mockResolvedValue([
                { value: 'live' },
            ]);
            (readValue as jest.Mock).mockResolvedValue({
                testuserIsStream: false,
            });

            await liveStart(params, email, reaction);

            expect(createVariable).toHaveBeenCalledWith(`${email}-twitch`);
            expect(setItem).toHaveBeenCalledWith(
                `${email}-twitch`,
                'testuserIsStream',
                true
            );
            expect(launchReaction).toHaveBeenCalledWith(
                'Test Reaction',
                params,
                [{ value: 'live' }],
                email
            );
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);

        it('should not launch reaction if streamer is not live', async () => {
            (getStreamerStatus as jest.Mock).mockResolvedValue(false);

            await liveStart(params, email, reaction);

            expect(setItem).toHaveBeenCalledWith(
                `${email}-twitch`,
                'testuserIsStream',
                false
            );
            expect(launchReaction).not.toHaveBeenCalled();
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);
    });

    describe('getCurrentGameOfStreamer', () => {
        it('should launch reaction with current game', async () => {
            (getCurrentGame as jest.Mock).mockResolvedValue([
                { value: 'game' },
            ]);

            await getCurrentGameOfStreamer(params, email, reaction);

            expect(launchReaction).toHaveBeenCalledWith(
                'Test Reaction',
                params,
                [{ value: 'game' }],
                email
            );
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);
    });

    describe('getSpecificTitle', () => {
        it('should launch reaction with specific title', async () => {
            (getCurrentTitle as jest.Mock).mockResolvedValue([
                { value: 'title' },
            ]);

            await getSpecificTitle(params, email, reaction);

            expect(launchReaction).toHaveBeenCalledWith(
                'Test Reaction',
                params,
                [{ value: 'title' }],
                email
            );
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);
    });

    describe('getMostViewedCategory', () => {
        it('should set most viewed category and launch reaction if category matches', async () => {
            (getTopGame as jest.Mock).mockResolvedValue([
                { value: 'category' },
            ]);
            (readValue as jest.Mock).mockResolvedValue({
                mostViewedCategory: 'oldCategory',
            });

            await getMostViewedCategory(params, email, reaction);

            expect(createVariable).toHaveBeenCalledWith(`${email}-twitch`);
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);

        it('should not launch reaction if category does not match', async () => {
            (getTopGame as jest.Mock).mockResolvedValue([
                { value: 'differentCategory' },
            ]);

            await getMostViewedCategory(params, email, reaction);

            expect(launchReaction).not.toHaveBeenCalled();
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);
    });
});
