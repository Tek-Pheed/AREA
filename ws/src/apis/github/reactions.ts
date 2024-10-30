import { getGithubToken } from './github.query';
import log from '../../utils/logger';
import { refreshSpotifyToken } from '../../utils/refresh';
import bodyParser from 'body-parser';

const axios = require('axios');

export async function createIssue(
    email: string,
    owner: string,
    repo: string,
    issueTitle: string,
    issueBody: string,
    issueAssigne: string,
    issueLabels: string[]
): Promise<boolean> {
    const { gAccessToken, gRefreshToken } = await getGithubToken(email);

    let data: any = {
        title: issueTitle,
        body: issueBody,
    };

    if (issueAssigne.length > 0) {
        data.assignee = issueAssigne;
    }

    if (issueLabels.length > 0 && issueLabels[0].length > 0) {
        data.labels = issueLabels;
    }

    data = JSON.stringify(data);

    try {
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `https://api.github.com/repos/${owner}/${repo}/issues`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.github+json',
                Authorization: `Bearer ${gAccessToken}`,
            },
            data: data,
        };
        const response = await axios.request(config);
        if (response.status === 201) {
            return true;
        } else {
            log.warn(
                `email:${email} service:Github Github create issue error: ${response.status}`
            );
            return false;
        }
    } catch (e) {
        log.error(`email:${email} service:Github ${e}`);
        return false;
    }
}

export async function createIssueComment(
    email: string,
    owner: string,
    repo: string,
    issueNumber: string,
    commentBody: string
): Promise<boolean> {
    const { gAccessToken, gRefreshToken } = await getGithubToken(email);
    try {
        let data = JSON.stringify({
            body: commentBody,
        });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.github+json',
                Authorization: `Bearer ${gAccessToken}`,
            },
            data: data,
        };
        const response = await axios.request(config);
        if (response.status === 201) {
            return true;
        } else {
            log.warn(
                `email:${email} Github create comment error: ${response.status}`
            );
            return false;
        }
    } catch (e) {
        log.error(`email:${email} service:Github ${e}`);
        return false;
    }
}

export async function createPullRequest(
    email: string,
    owner: string,
    repo: string,
    prTitle: string,
    prBody: string,
    prHeadBranch: string,
    prBaseBranch: string,
    prIsDraft: boolean
): Promise<boolean> {
    const { gAccessToken, gRefreshToken } = await getGithubToken(email);
    try {
        let data = JSON.stringify({
            title: prTitle,
            head: prHeadBranch,
            base: prBaseBranch,
            body: prBody,
            draft: prIsDraft,
        });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `https://api.github.com/repos/${owner}/${repo}/pulls`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.github+json',
                Authorization: `Bearer ${gAccessToken}`,
            },
            data: data,
        };
        const response = await axios.request(config);
        if (response.status === 201) {
            return true;
        } else {
            log.warn(
                `email:${email} service:Github Github create pr error: ${response.status}`
            );
            return false;
        }
    } catch (e) {
        log.error(`email:${email} service:Github ${e}`);
        return false;
    }
}

export async function mergePullRequest(
    email: string,
    owner: string,
    repo: string,
    prNumber: string,
    commitTitle: string,
    commitMessage: string
): Promise<boolean> {
    const { gAccessToken, gRefreshToken } = await getGithubToken(email);
    try {
        let data = JSON.stringify({
            commit_title: commitTitle,
            commit_message: commitMessage,
        });
        let config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/merge`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.github+json',
                Authorization: `Bearer ${gAccessToken}`,
            },
            data: data,
        };
        const response = await axios.request(config);
        if (response.status === 200) {
            return true;
        } else {
            log.warn(
                `email:${email} service:Github Github merge pr error: ${response.status}`
            );
            return false;
        }
    } catch (e) {
        log.error(`email:${email} service:Github ${e}`);
        return false;
    }
}

export async function rerunWorkflow(
    email: string,
    owner: string,
    repo: string,
    workflowRunId: string,
    workflowDebugLoggin: boolean
): Promise<boolean> {
    const { gAccessToken, gRefreshToken } = await getGithubToken(email);
    try {
        let data = JSON.stringify({
            enable_debug_logging: workflowDebugLoggin,
        });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `https://api.github.com/repos/${owner}/${repo}/actions/runs/${workflowRunId}/rerun`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.github+json',
                Authorization: `Bearer ${gAccessToken}`,
            },
            data: data,
        };
        const response = await axios.request(config);
        if (response.status === 201) {
            return true;
        } else {
            log.warn(
                `email:${email} service:Github Github re run error: ${response.status}`
            );
            return false;
        }
    } catch (e) {
        log.error(`email:${email} service:Github ${e}`);
        return false;
    }
}

export async function rerunWorkflowFailedJobs(
    email: string,
    owner: string,
    repo: string,
    workflowRunId: string,
    workflowDebugLoggin: boolean
): Promise<boolean> {
    const { gAccessToken, gRefreshToken } = await getGithubToken(email);
    try {
        let data = JSON.stringify({
            enable_debug_logging: workflowDebugLoggin,
        });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `https://api.github.com/repos/${owner}/${repo}/actions/runs/${workflowRunId}/rerun-failed-jobs`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.github+json',
                Authorization: `Bearer ${gAccessToken}`,
            },
            data: data,
        };
        const response = await axios.request(config);
        if (response.status === 201) {
            return true;
        } else {
            log.warn(
                `email:${email} service:Github Github merge pr error: ${response.status}`
            );
            return false;
        }
    } catch (e) {
        log.error(`email:${email} service:Github ${e}`);
        return false;
    }
}
