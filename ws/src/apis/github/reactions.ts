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
    const { sAccessToken, sRefreshToken } = await getGithubToken(email);

    let data = JSON.stringify({
        title: issueTitle,
        body: issueBody,
        assignee: issueAssigne,
        labels: issueLabels,
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://api.github.com/repos/${owner}/${repo}/issues`,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${sAccessToken}`,
        },
        data: data,
    };
    const response = await axios.request(config);
    if (response.status === 201) {
        return true;
    } else {
        console.warn('Github create issue error: ' + response.status);
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
    const { sAccessToken, sRefreshToken } = await getGithubToken(email);

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
            Authorization: `Bearer ${sAccessToken}`,
        },
        data: data,
    };
    const response = await axios.request(config);
    if (response.status === 201) {
        return true;
    } else {
        console.warn('Github create comment error: ' + response.status);
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
    const { sAccessToken, sRefreshToken } = await getGithubToken(email);

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
            Authorization: `Bearer ${sAccessToken}`,
        },
        data: data,
    };
    const response = await axios.request(config);
    if (response.status === 201) {
        return true;
    } else {
        console.warn('Github create pr error: ' + response.status);
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
    const { sAccessToken, sRefreshToken } = await getGithubToken(email);

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
            Authorization: `Bearer ${sAccessToken}`,
        },
        data: data,
    };
    const response = await axios.request(config);
    if (response.status === 201) {
        return true;
    } else {
        console.warn('Github merge pr error: ' + response.status);
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
    const { sAccessToken, sRefreshToken } = await getGithubToken(email);

    let data = JSON.stringify({
        enable_debug_logging: workflowDebugLoggin,
    });
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://api.github.com/repos/${repo}/${owner}/actions/runs/${workflowRunId}/rerun`,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${sAccessToken}`,
        },
        data: data,
    };
    const response = await axios.request(config);
    if (response.status === 201) {
        return true;
    } else {
        console.warn('Github merge pr error: ' + response.status);
        return false;
    }
}
