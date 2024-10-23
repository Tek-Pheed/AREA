jest.mock('../../apis/google/reactions');
jest.mock('../../utils/logger');

import { IBody } from '../../utils/data.model';
import { db, pool } from '../../utils/database';
import * as googleApi from '../../apis/google/reactions';
import { setEventInCalendar } from '../../core/reactions/google.reactions';

describe('google.reactions.ts', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    afterAll(async () => {
        db.end((err) => {
            if (err) {
                console.error('Error closing the connection:', err);
            }
        });
        pool.end((err) => {
            if (err) {
                console.error('Error closing pool connections:', err);
            }
        });
    });

    const email = 'raphael.scandella@epitech.eu';
    const params: IBody = {
        reaction: [
            { value: 'value1', name: 'param1' },
            { value: 'value2', name: 'param2' },
            { value: 'value3', name: 'param3' },
            { value: 'value4', name: 'param4' },
        ],
        action: [],
    };

    it('should call setEventCalendar with correct parameters', async () => {
        jest.spyOn(googleApi, 'setEventCalendar').mockImplementation(jest.fn());
        await setEventInCalendar(params, email);
        expect(googleApi.setEventCalendar).toHaveBeenCalledWith(
            email,
            'value1',
            'value2',
            'value3',
            'value4'
        );
    });
});
