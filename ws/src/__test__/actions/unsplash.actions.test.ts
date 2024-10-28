import { whenPostPhoto } from '../../core/actions/unsplash.actions';
import { getUserLastPictures } from '../../apis/unsplash/actions';
import { createVariable, readValue, setItem } from '../../utils/storage';
import { launchReaction } from '../../core/reaction.manager';
import log from '../../utils/logger';
import { IBody } from '../../utils/data.model';

jest.mock('../../apis/unsplash/actions');
jest.mock('../../utils/storage');
jest.mock('../../core/reaction.manager');
jest.mock('../../utils/logger');

describe('whenPostPhoto', () => {
    const email = 'test@example.com';
    const reaction = [{ title: 'Test Reaction' }];
    const params: IBody = {
        action: [
            {
                value: 'testValue',
                name: '',
            },
        ],
        reaction: [
            {
                value: 'testReaction',
                name: '',
            },
        ],
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a variable and set item if new post is found', async () => {
        const mockResult = [{ value: 'newPostID' }];
        (getUserLastPictures as jest.Mock).mockResolvedValue(mockResult);
        (readValue as jest.Mock).mockResolvedValue({ lastPostID: 'oldPostID' });

        await whenPostPhoto(params, email, reaction);

        expect(createVariable).toHaveBeenCalledWith(`${email}-unsplash`);
        expect(setItem).toHaveBeenCalledWith(
            `${email}-unsplash`,
            'lastPostID',
            'newPostID'
        );
        expect(launchReaction).toHaveBeenCalledWith(
            reaction[0].title,
            params,
            mockResult,
            email
        );
        expect(log.debug).toHaveBeenCalledWith(mockResult);
        await new Promise((r) => setTimeout(r, 3500));
    }, 5000);

    it('should not set item or launch reaction if post ID is the same', async () => {
        const mockResult = [{ value: 'samePostID' }];
        (getUserLastPictures as jest.Mock).mockResolvedValue(mockResult);
        (readValue as jest.Mock).mockResolvedValue({
            lastPostID: 'samePostID',
        });

        await whenPostPhoto(params, email, reaction);

        expect(setItem).not.toHaveBeenCalled();
        expect(launchReaction).not.toHaveBeenCalled();
        expect(log.debug).not.toHaveBeenCalled();
        await new Promise((r) => setTimeout(r, 3500));
    }, 5000);

    it('should not set item or launch reaction if result is false', async () => {
        (getUserLastPictures as jest.Mock).mockResolvedValue(false);

        await whenPostPhoto(params, email, reaction);

        expect(setItem).not.toHaveBeenCalled();
        expect(launchReaction).not.toHaveBeenCalled();
        expect(log.debug).not.toHaveBeenCalled();
        await new Promise((r) => setTimeout(r, 3500));
    }, 5000);
});
