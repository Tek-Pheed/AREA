import { IBody } from '../../utils/data.model';
import { db, pool } from '../../utils/database';
import * as githubApi from '../../apis/github/reactions';

import {
    createIssueOnRepo,
    createPR,
    mergePR,
    createComment,
    reRunFailedWorkflow,
    reRunWorkflow,
} from '../../core/reactions/github.reactions';

describe('github.reactions.ts', () => {
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

    jest.mock('../../apis/github/reactions');
    jest.mock('../../utils/logger');

    const email = 'raphael.scandella@epitech.eu';
    const params: IBody = {
        reaction: [
            { value: 'value1', name: 'param1' },
            { value: 'value2', name: 'param2' },
            { value: 'value3', name: 'param3' },
            { value: 'value4', name: 'param4' },
            { value: 'value5', name: 'param5' },
            { value: 'value6', name: 'param6' },
            { value: 'true', name: 'param7' },
        ],
        action: [],
    };

    it('should call createIssue with correct parameters', async () => {
        jest.spyOn(githubApi, 'createIssue').mockImplementation(jest.fn());
        await createIssueOnRepo(params, email);
        expect(githubApi.createIssue).toHaveBeenCalledWith(
            email,
            'value1',
            'value2',
            'value3',
            'value4',
            'value5',
            ['value6']
        );
    });

    it('should call createPullRequest with correct parameters', async () => {
        jest.spyOn(githubApi, 'createPullRequest').mockImplementation(
            jest.fn()
        );
        await createPR(params, email);
        expect(githubApi.createPullRequest).toHaveBeenCalledWith(
            email,
            'value1',
            'value2',
            'value3',
            'value4',
            'value5',
            'value6',
            true
        );
    });

    it('should call mergePullRequest with correct parameters', async () => {
        jest.spyOn(githubApi, 'mergePullRequest').mockImplementation(jest.fn());
        await mergePR(params, email);
        expect(githubApi.mergePullRequest).toHaveBeenCalledWith(
            email,
            'value1',
            'value2',
            'value3',
            'value4',
            'value5'
        );
    });

    it('should call createIssueComment with correct parameters', async () => {
        jest.spyOn(githubApi, 'createIssueComment').mockImplementation(
            jest.fn()
        );
        await createComment(params, email);
        expect(githubApi.createIssueComment).toHaveBeenCalledWith(
            email,
            'value1',
            'value2',
            'value3',
            'value4'
        );
    });

    it('should call rerunWorkflowFailedJobs with correct parameters', async () => {
        jest.spyOn(githubApi, 'rerunWorkflowFailedJobs').mockImplementation(
            jest.fn()
        );
        await reRunFailedWorkflow(params, email);
        expect(githubApi.rerunWorkflowFailedJobs).toHaveBeenCalledWith(
            email,
            'value2',
            'value1',
            'value3',
            true
        );
    });

    it('should call rerunWorkflow with correct parameters', async () => {
        jest.spyOn(githubApi, 'rerunWorkflow').mockImplementation(jest.fn());
        await reRunWorkflow(params, email);
        expect(githubApi.rerunWorkflow).toHaveBeenCalledWith(
            email,
            'value2',
            'value1',
            'value3',
            true
        );
    });
});
