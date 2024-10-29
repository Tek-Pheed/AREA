import {
    whenNewCommitByMe,
    whenLastWorkflowFailed,
    whenLastWorkflowSuccess,
    whenLastWorkflowInProgress,
} from '../../core/actions/github.actions';
import { createVariable } from '../../utils/storage';
import fs from 'fs';
import log from '../../utils/logger';
import {
    getCommitFromSpecificUser,
    getActionWhenKo,
    getActionWhenOk,
    getActionInProgress,
} from '../../apis/github/actions';
import { IBody } from '../../utils/data.model';

jest.mock('fs');
jest.mock('../../utils/logger');
jest.mock('../../utils/storage');
jest.mock('../../core/reaction.manager');
jest.mock('../../apis/github/actions');
jest.mock('../../utils/database', () => ({
    db: jest.fn(),
    pool: {
        query: jest.fn(),
    },
}));

describe('GitHub Actions', () => {
    const email = 'test@example.com';
    const reaction = [{ title: 'Test Reaction' }];
    const params: IBody = {
        action: [
            {
                value: 'repo',
                name: '',
            },
            {
                value: 'branch',
                name: '',
            },
        ],
        reaction: [{ name: 'reactionName', value: 'reactionValue' }],
    };

    test('whenNewCommitByMe - no commits', async () => {
        (getCommitFromSpecificUser as jest.Mock).mockResolvedValue([]);
        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({}));

        await whenNewCommitByMe(params, email, reaction);

        expect(log.warn).toHaveBeenCalledWith(
            `email:${email} service:Github No commit on this repositories`
        );
    });

    test('whenLastWorkflowFailed - no failed workflows', async () => {
        (getActionWhenKo as jest.Mock).mockResolvedValue([]);
        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({}));

        await whenLastWorkflowFailed(params, email, reaction);

        expect(log.warn).toHaveBeenCalledWith(
            `email:${email} service:Github No workflow have failed`
        );
    });

    test('whenLastWorkflowSuccess - no successful workflows', async () => {
        (getActionWhenOk as jest.Mock).mockResolvedValue([]);
        (createVariable as jest.Mock).mockResolvedValue({});

        await whenLastWorkflowSuccess(params, email, reaction);

        expect(log.warn).toHaveBeenCalledWith(
            `email:${email} service:Github No workflow success`
        );
    });

    test('whenLastWorkflowInProgress - no workflows in progress', async () => {
        (getActionInProgress as jest.Mock).mockResolvedValue([]);
        (createVariable as jest.Mock).mockResolvedValue({});

        await whenLastWorkflowInProgress(params, email, reaction);

        expect(log.warn).toHaveBeenCalledWith(
            `email:${email} service:Github No workflow in progress currently`
        );
    });
});
