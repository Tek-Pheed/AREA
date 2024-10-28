import { whenThereIsAEventToday } from '../../core/actions/google.actions';
import { getEvents } from '../../apis/google/actions';
import { createVariable, readValue, setItem } from '../../utils/storage';
import { launchReaction } from '../../core/reaction.manager';
import { IBody } from '../../utils/data.model';
import { db, pool } from '../../utils/database';

jest.mock('../../apis/google/actions');
jest.mock('../../utils/storage');
jest.mock('../../core/reaction.manager');

describe('whenThereIsAEventToday', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    const email = 'test@example.com';
    const reaction = [{ title: 'Test Reaction' }];
    const params: IBody = {
        action: [],
        reaction: [{ name: 'some', value: 'params' }],
    };

    it('should create a variable and do nothing if no events are found', async () => {
        (getEvents as jest.Mock).mockResolvedValue(false);

        await whenThereIsAEventToday(params, email, reaction);

        expect(createVariable).toHaveBeenCalledWith(`${email}-google`);
        expect(readValue).not.toHaveBeenCalled();
        expect(setItem).not.toHaveBeenCalled();
        expect(launchReaction).not.toHaveBeenCalled();
        //do a timeout of 5000ms
        await new Promise((r) => setTimeout(r, 3500));
    }, 5000);

    it('should set nextEvent and launch reaction if event is new', async () => {
        const event = [{ value: 'newEvent' }];
        (getEvents as jest.Mock).mockResolvedValue(event);
        (readValue as jest.Mock).mockResolvedValue({ nextEvent: 'oldEvent' });

        await whenThereIsAEventToday(params, email, reaction);

        expect(createVariable).toHaveBeenCalledWith(`${email}-google`);
        expect(readValue).toHaveBeenCalledWith(`${email}-google`);
        expect(setItem).toHaveBeenCalledWith(
            `${email}-google`,
            'nextEvent',
            'newEvent'
        );
        expect(launchReaction).toHaveBeenCalledWith(
            'Test Reaction',
            params,
            event,
            email
        );
        await new Promise((r) => setTimeout(r, 3500));
    }, 5000);

    it('should not launch reaction if event is not new', async () => {
        const event = [{ value: 'sameEvent' }];
        (getEvents as jest.Mock).mockResolvedValue(event);
        (readValue as jest.Mock).mockResolvedValue({ nextEvent: 'sameEvent' });

        await whenThereIsAEventToday(params, email, reaction);

        expect(createVariable).toHaveBeenCalledWith(`${email}-google`);
        expect(readValue).toHaveBeenCalledWith(`${email}-google`);
        expect(setItem).not.toHaveBeenCalled();
        expect(launchReaction).not.toHaveBeenCalled();
        await new Promise((r) => setTimeout(r, 3500));
    }, 5000);
});
