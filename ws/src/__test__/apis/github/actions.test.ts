import axios from 'axios';
import {
    getCommitFromSpecificUser,
    getActionWhenKo,
    getActionWhenOk,
    getActionInProgress,
} from '../../../apis/github/actions';
import { getGithubToken } from '../../../apis/github/github.query';
import { db, pool } from '../../../utils/database';
jest.mock('axios');
jest.mock('../../../apis/github/github.query');
jest.mock('../../../utils/logger');

describe('GitHub Actions API', () => {
    const org = 'testOrg';
    const repos = 'testRepo';
    const email = 'test@example.com';
    const gAccessToken = 'mockAccessToken';
    const gRefreshToken = 'mockRefreshToken';

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

    it('should return commit details if commits are found for the specific user', async () => {
        const emailInput = 'author@example.com';
        const mockCommit = {
            sha: 'mockSha',
            commit: {
                author: { name: 'Author Name', email: 'author@example.com' },
                message: 'Commit message',
            },
        };

        (getGithubToken as jest.Mock).mockResolvedValue({
            gAccessToken,
            gRefreshToken,
        });
        (axios.get as jest.Mock).mockResolvedValue({
            data: [mockCommit],
        });

        const result = await getCommitFromSpecificUser(
            org,
            repos,
            emailInput,
            email
        );

        expect(getGithubToken).toHaveBeenCalledWith(email);
        expect(axios.get).toHaveBeenCalledWith(
            `https://api.github.com/repos/${org}/${repos}/commits?author=${emailInput}`,
            {
                headers: {
                    Authorization: `Bearer ${gAccessToken}`,
                    accept: 'application/vnd.github+json',
                },
            }
        );
        expect(result).toEqual([
            { name: 'sha', value: mockCommit.sha },
            { name: 'userName', value: mockCommit.commit.author.name },
            { name: 'userEmail', value: mockCommit.commit.author.email },
            { name: 'messageCommit', value: mockCommit.commit.message },
            { name: 'repoName', value: repos },
            { name: 'orgName', value: org },
        ]);
    });

    it('should return false if no commits are found for the specific user', async () => {
        const emailInput = 'author@example.com';

        (getGithubToken as jest.Mock).mockResolvedValue({
            gAccessToken,
            gRefreshToken,
        });
        (axios.get as jest.Mock).mockResolvedValue({ data: [] });

        const result = await getCommitFromSpecificUser(
            org,
            repos,
            emailInput,
            email
        );

        expect(getGithubToken).toHaveBeenCalledWith(email);
        expect(axios.get).toHaveBeenCalledWith(
            `https://api.github.com/repos/${org}/${repos}/commits?author=${emailInput}`,
            {
                headers: {
                    Authorization: `Bearer ${gAccessToken}`,
                    accept: 'application/vnd.github+json',
                },
            }
        );
        expect(result).toEqual([]);
    });

    it('should return false and log error if an error occurs in getCommitFromSpecificUser', async () => {
        const emailInput = 'author@example.com';
        const mockError = new Error('Network Error');

        (getGithubToken as jest.Mock).mockResolvedValue({
            gAccessToken,
            gRefreshToken,
        });
        (axios.get as jest.Mock).mockRejectedValue(mockError);

        const result = await getCommitFromSpecificUser(
            org,
            repos,
            emailInput,
            email
        );

        expect(getGithubToken).toHaveBeenCalledWith(email);
        expect(axios.get).toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('should return action details if failed actions are found', async () => {
        const mockAction = {
            id: 'mockId',
            actor: { login: 'actorLogin', id: 'actorId' },
            workflow_id: 'workflowId',
            repository: {
                id: 'repoId',
                name: 'repoName',
                full_name: 'repoFullName',
            },
        };

        (getGithubToken as jest.Mock).mockResolvedValue({
            gAccessToken,
            gRefreshToken,
        });
        (axios.get as jest.Mock).mockResolvedValue({
            data: { workflow_runs: [mockAction] },
        });

        const result = await getActionWhenKo(org, repos, email);

        expect(getGithubToken).toHaveBeenCalledWith(email);
        expect(axios.get).toHaveBeenCalledWith(
            `https://api.github.com/repos/${org}/${repos}/actions/runs?status=failure`,
            {
                headers: {
                    Authorization: `Bearer ${gAccessToken}`,
                    accept: 'application/vnd.github+json',
                },
            }
        );
        expect(result).toEqual([
            { name: 'id', value: mockAction.id },
            { name: 'actor', value: mockAction.actor.login },
            { name: 'workflow_id', value: mockAction.workflow_id },
            { name: 'idActor', value: mockAction.actor.id },
            { name: 'idRepo', value: mockAction.repository.id },
            { name: 'nameRepo', value: mockAction.repository.name },
            { name: 'fullnameRepo', value: mockAction.repository.full_name },
            { name: 'repoName', value: repos },
            { name: 'orgName', value: org },
        ]);
    });

    it('should return false if no failed actions are found', async () => {
        (getGithubToken as jest.Mock).mockResolvedValue({
            gAccessToken,
            gRefreshToken,
        });
        (axios.get as jest.Mock).mockResolvedValue({
            data: { workflow_runs: [] },
        });

        const result = await getActionWhenKo(org, repos, email);

        expect(getGithubToken).toHaveBeenCalledWith(email);
        expect(axios.get).toHaveBeenCalledWith(
            `https://api.github.com/repos/${org}/${repos}/actions/runs?status=failure`,
            {
                headers: {
                    Authorization: `Bearer ${gAccessToken}`,
                    accept: 'application/vnd.github+json',
                },
            }
        );
        expect(result).toEqual([]);
    });

    it('should return false and log error if an error occurs in getActionWhenKo', async () => {
        const mockError = new Error('Network Error');

        (getGithubToken as jest.Mock).mockResolvedValue({
            gAccessToken,
            gRefreshToken,
        });
        (axios.get as jest.Mock).mockRejectedValue(mockError);

        const result = await getActionWhenKo(org, repos, email);

        expect(getGithubToken).toHaveBeenCalledWith(email);
        expect(axios.get).toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('should return action details if successful actions are found', async () => {
        const mockAction = {
            id: 'mockId',
            actor: { login: 'actorLogin', id: 'actorId' },
            workflow_id: 'workflowId',
            repository: {
                id: 'repoId',
                name: 'repoName',
                full_name: 'repoFullName',
            },
        };

        (getGithubToken as jest.Mock).mockResolvedValue({
            gAccessToken,
            gRefreshToken,
        });
        (axios.get as jest.Mock).mockResolvedValue({
            data: { workflow_runs: [mockAction] },
        });

        const result = await getActionWhenOk(org, repos, email);

        expect(getGithubToken).toHaveBeenCalledWith(email);
        expect(axios.get).toHaveBeenCalledWith(
            `https://api.github.com/repos/${org}/${repos}/actions/runs?status=success`,
            {
                headers: {
                    Authorization: `Bearer ${gAccessToken}`,
                    accept: 'application/vnd.github+json',
                },
            }
        );
        expect(result).toEqual([
            { name: 'id', value: mockAction.id },
            { name: 'actor', value: mockAction.actor.login },
            { name: 'workflow_id', value: mockAction.workflow_id },
            { name: 'idActor', value: mockAction.actor.id },
            { name: 'idRepo', value: mockAction.repository.id },
            { name: 'nameRepo', value: mockAction.repository.name },
            { name: 'fullnameRepo', value: mockAction.repository.full_name },
            { name: 'repoName', value: repos },
            { name: 'orgName', value: org },
        ]);
    });

    it('should return false if no successful actions are found', async () => {
        (getGithubToken as jest.Mock).mockResolvedValue({
            gAccessToken,
            gRefreshToken,
        });
        (axios.get as jest.Mock).mockResolvedValue({
            data: { workflow_runs: [] },
        });

        const result = await getActionWhenOk(org, repos, email);

        expect(getGithubToken).toHaveBeenCalledWith(email);
        expect(axios.get).toHaveBeenCalledWith(
            `https://api.github.com/repos/${org}/${repos}/actions/runs?status=success`,
            {
                headers: {
                    Authorization: `Bearer ${gAccessToken}`,
                    accept: 'application/vnd.github+json',
                },
            }
        );
        expect(result).toEqual([]);
    });

    it('should return false and log error if an error occurs in getActionWhenOk', async () => {
        const mockError = new Error('Network Error');

        (getGithubToken as jest.Mock).mockResolvedValue({
            gAccessToken,
            gRefreshToken,
        });
        (axios.get as jest.Mock).mockRejectedValue(mockError);

        const result = await getActionWhenOk(org, repos, email);

        expect(getGithubToken).toHaveBeenCalledWith(email);
        expect(axios.get).toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('should return action details if in-progress actions are found', async () => {
        const mockAction = {
            id: 'mockId',
            actor: { login: 'actorLogin', id: 'actorId' },
            workflow_id: 'workflowId',
            repository: {
                id: 'repoId',
                name: 'repoName',
                full_name: 'repoFullName',
            },
        };

        (getGithubToken as jest.Mock).mockResolvedValue({
            gAccessToken,
            gRefreshToken,
        });
        (axios.get as jest.Mock).mockResolvedValue({
            data: { workflow_runs: [mockAction] },
        });

        const result = await getActionInProgress(org, repos, email);

        expect(getGithubToken).toHaveBeenCalledWith(email);
        expect(axios.get).toHaveBeenCalledWith(
            `https://api.github.com/repos/${org}/${repos}/actions/runs?status=in_progress`,
            {
                headers: {
                    Authorization: `Bearer ${gAccessToken}`,
                    accept: 'application/vnd.github+json',
                },
            }
        );
        expect(result).toEqual([
            { name: 'id', value: mockAction.id },
            { name: 'actor', value: mockAction.actor.login },
            { name: 'workflow_id', value: mockAction.workflow_id },
            { name: 'idActor', value: mockAction.actor.id },
            { name: 'idRepo', value: mockAction.repository.id },
            { name: 'nameRepo', value: mockAction.repository.name },
            { name: 'fullnameRepo', value: mockAction.repository.full_name },
            { name: 'repoName', value: repos },
            { name: 'orgName', value: org },
        ]);
    });

    it('should return false if no in-progress actions are found', async () => {
        (getGithubToken as jest.Mock).mockResolvedValue({
            gAccessToken,
            gRefreshToken,
        });
        (axios.get as jest.Mock).mockResolvedValue({
            data: { workflow_runs: [] },
        });

        const result = await getActionInProgress(org, repos, email);

        expect(getGithubToken).toHaveBeenCalledWith(email);
        expect(axios.get).toHaveBeenCalledWith(
            `https://api.github.com/repos/${org}/${repos}/actions/runs?status=in_progress`,
            {
                headers: {
                    Authorization: `Bearer ${gAccessToken}`,
                    accept: 'application/vnd.github+json',
                },
            }
        );
        expect(result).toEqual([]);
    });

    it('should return false and log error if an error occurs in getActionInProgress', async () => {
        const mockError = new Error('Network Error');

        (getGithubToken as jest.Mock).mockResolvedValue({
            gAccessToken,
            gRefreshToken,
        });
        (axios.get as jest.Mock).mockRejectedValue(mockError);

        const result = await getActionInProgress(org, repos, email);

        expect(getGithubToken).toHaveBeenCalledWith(email);
        expect(axios.get).toHaveBeenCalled();
        expect(result).toBe(false);
    });
});
