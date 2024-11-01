import request from 'supertest';
import {
    createIssue,
    createIssueComment,
    createPullRequest,
    mergePullRequest,
    rerunWorkflow,
    rerunWorkflowFailedJobs,
} from '../../../apis/github/reactions';
import { getGithubToken } from '../../../apis/github/github.query';
import axios from 'axios';
import { db, pool } from '../../../utils/database';

jest.mock('axios');
jest.mock('../../../apis/github/github.query');

describe('GitHub API functions', () => {
    const email = 'test@example.com';
    const owner = 'testOwner';
    const repo = 'testRepo';
    const gAccessToken = 'testAccessToken';
    const gRefreshToken = 'testRefreshToken';

    beforeEach(() => {
        (getGithubToken as jest.Mock).mockResolvedValue({
            gAccessToken,
            gRefreshToken,
        });
    });

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

    describe('createIssue', () => {
        it('should create an issue successfully', async () => {
            (axios.request as jest.Mock).mockResolvedValue({ status: 201 });

            const result = await createIssue(
                email,
                owner,
                repo,
                'Issue Title',
                'Issue Body',
                'assignee',
                ['label1']
            );

            expect(result).toBe(true);
            expect(axios.request).toHaveBeenCalledWith(
                expect.objectContaining({
                    method: 'post',
                    url: `https://api.github.com/repos/${owner}/${repo}/issues`,
                    headers: expect.objectContaining({
                        Authorization: `Bearer ${gAccessToken}`,
                    }),
                })
            );
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);

        it('should handle error when creating an issue', async () => {
            (axios.request as jest.Mock).mockResolvedValue({ status: 400 });

            const result = await createIssue(
                email,
                owner,
                repo,
                'Issue Title',
                'Issue Body',
                'assignee',
                ['label1']
            );

            expect(result).toBe(false);
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);
    });

    describe('createIssueComment', () => {
        it('should create an issue comment successfully', async () => {
            (axios.request as jest.Mock).mockResolvedValue({ status: 201 });

            const result = await createIssueComment(
                email,
                owner,
                repo,
                '1',
                'Comment Body'
            );

            expect(result).toBe(true);
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);

        it('should handle error when creating an issue comment', async () => {
            (axios.request as jest.Mock).mockResolvedValue({ status: 400 });

            const result = await createIssueComment(
                email,
                owner,
                repo,
                '1',
                'Comment Body'
            );

            expect(result).toBe(false);
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);
    });

    describe('createPullRequest', () => {
        it('should create a pull request successfully', async () => {
            (axios.request as jest.Mock).mockResolvedValue({ status: 201 });

            const result = await createPullRequest(
                email,
                owner,
                repo,
                'PR Title',
                'PR Body',
                'headBranch',
                'baseBranch',
                false
            );

            expect(result).toBe(true);
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);

        it('should handle error when creating a pull request', async () => {
            (axios.request as jest.Mock).mockResolvedValue({ status: 400 });

            const result = await createPullRequest(
                email,
                owner,
                repo,
                'PR Title',
                'PR Body',
                'headBranch',
                'baseBranch',
                false
            );

            expect(result).toBe(false);
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);
    });

    describe('mergePullRequest', () => {
        it('should merge a pull request successfully', async () => {
            (axios.request as jest.Mock).mockResolvedValue({ status: 200 });

            const result = await mergePullRequest(
                email,
                owner,
                repo,
                '1',
                'Commit Title',
                'Commit Message'
            );

            expect(result).toBe(true);
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);

        it('should handle error when merging a pull request', async () => {
            (axios.request as jest.Mock).mockResolvedValue({ status: 400 });

            const result = await mergePullRequest(
                email,
                owner,
                repo,
                '1',
                'Commit Title',
                'Commit Message'
            );

            expect(result).toBe(false);
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);
    });

    describe('rerunWorkflow', () => {
        it('should rerun a workflow successfully', async () => {
            (axios.request as jest.Mock).mockResolvedValue({ status: 201 });

            const result = await rerunWorkflow(email, owner, repo, '1', true);

            expect(result).toBe(true);
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);

        it('should handle error when rerunning a workflow', async () => {
            (axios.request as jest.Mock).mockResolvedValue({ status: 400 });

            const result = await rerunWorkflow(email, owner, repo, '1', true);

            expect(result).toBe(false);
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);
    });

    describe('rerunWorkflowFailedJobs', () => {
        it('should rerun failed jobs in a workflow successfully', async () => {
            (axios.request as jest.Mock).mockResolvedValue({ status: 201 });

            const result = await rerunWorkflowFailedJobs(
                email,
                owner,
                repo,
                '1',
                true
            );

            expect(result).toBe(true);
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);

        it('should handle error when rerunning failed jobs in a workflow', async () => {
            (axios.request as jest.Mock).mockResolvedValue({ status: 400 });

            const result = await rerunWorkflowFailedJobs(
                email,
                owner,
                repo,
                '1',
                true
            );

            expect(result).toBe(false);
            await new Promise((r) => setTimeout(r, 3500));
        }, 5000);
    });
});
