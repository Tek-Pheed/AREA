import { getGithubToken } from './github.query';
import log from '../../utils/logger';
const axios = require('axios');

export async function getCommitFromSpecificUser(
    org: string,
    repos: string,
    emailInput: string,
    email: string
): Promise<any> {
    try {
        const { gAccessToken, gRefreshToken } = await getGithubToken(email);
        const response = await axios.get(
            `https://api.github.com/repos/${org}/${repos}/commits?author=${emailInput}`,
            {
                headers: {
                    Authorization: `Bearer ${gAccessToken}`,
                    accept: 'application/vnd.github+json',
                },
            }
        );
        if (!response.data) {
            return false;
        }

        if (response.data.length === 0) {
            return [];
        }

        return [
            {
                name: 'sha',
                value: response.data[0].sha,
            },
            {
                name: 'userName',
                value: response.data[0].commit.author.name,
            },
            {
                name: 'userEmail',
                value: response.data[0].commit.author.email,
            },
            {
                name: 'messageCommit',
                value: response.data[0].commit.message,
            },
            {
                name: 'repoName',
                value: repos,
            },
            {
                name: 'orgName',
                value: org,
            },
        ];
    } catch (e) {
        log.error(`email:${email} service:Github ${e}`);
        return false;
    }
}

export async function getActionWhenKo(
    org: string,
    repos: string,
    email: string
): Promise<any> {
    try {
        const { gAccessToken, gRefreshToken } = await getGithubToken(email);
        const response = await axios.get(
            `https://api.github.com/repos/${org}/${repos}/actions/runs?status=failure`,
            {
                headers: {
                    Authorization: `Bearer ${gAccessToken}`,
                    accept: 'application/vnd.github+json',
                },
            }
        );

        if (!response.data) {
            return false;
        }

        if (response.data.workflow_runs.length === 0) {
            return [];
        }

        return [
            {
                name: 'id',
                value: response.data.workflow_runs[0].id,
            },
            {
                name: 'actor',
                value: response.data.workflow_runs[0].actor.login,
            },
            {
                name: 'workflow_id',
                value: response.data.workflow_runs[0].workflow_id,
            },
            {
                name: 'idActor',
                value: response.data.workflow_runs[0].actor.id,
            },
            {
                name: 'idRepo',
                value: response.data.workflow_runs[0].repository.id,
            },
            {
                name: 'nameRepo',
                value: response.data.workflow_runs[0].repository.name,
            },
            {
                name: 'fullnameRepo',
                value: response.data.workflow_runs[0].repository.full_name,
            },
            {
                name: 'repoName',
                value: repos,
            },
            {
                name: 'orgName',
                value: org,
            },
        ];
    } catch (e) {
        log.error(`email:${email} service:Github ${e}`);
        return false;
    }
}

export async function getActionWhenOk(
    org: string,
    repos: string,
    email: string
): Promise<any> {
    try {
        const { gAccessToken, gRefreshToken } = await getGithubToken(email);
        const response = await axios.get(
            `https://api.github.com/repos/${org}/${repos}/actions/runs?status=success`,
            {
                headers: {
                    Authorization: `Bearer ${gAccessToken}`,
                    accept: 'application/vnd.github+json',
                },
            }
        );
        if (!response.data) {
            return false;
        }

        if (response.data.workflow_runs.length === 0) {
            return [];
        }

        return [
            {
                name: 'id',
                value: response.data.workflow_runs[0].id,
            },
            {
                name: 'actor',
                value: response.data.workflow_runs[0].actor.login,
            },
            {
                name: 'workflow_id',
                value: response.data.workflow_runs[0].workflow_id,
            },
            {
                name: 'idActor',
                value: response.data.workflow_runs[0].actor.id,
            },
            {
                name: 'idRepo',
                value: response.data.workflow_runs[0].repository.id,
            },
            {
                name: 'nameRepo',
                value: response.data.workflow_runs[0].repository.name,
            },
            {
                name: 'fullnameRepo',
                value: response.data.workflow_runs[0].repository.full_name,
            },
            {
                name: 'repoName',
                value: repos,
            },
            {
                name: 'orgName',
                value: org,
            },
        ];
    } catch (e) {
        log.error(`email:${email} service:Github ${e}`);
        return false;
    }
}

export async function getActionInProgress(
    org: string,
    repos: string,
    email: string
): Promise<any> {
    try {
        const { gAccessToken, gRefreshToken } = await getGithubToken(email);
        const response = await axios.get(
            `https://api.github.com/repos/${org}/${repos}/actions/runs?status=in_progress`,
            {
                headers: {
                    Authorization: `Bearer ${gAccessToken}`,
                    accept: 'application/vnd.github+json',
                },
            }
        );
        if (!response.data) {
            return false;
        }

        if (response.data.workflow_runs.length === 0) {
            return [];
        }

        return [
            {
                name: 'id',
                value: response.data.workflow_runs[0].id,
            },
            {
                name: 'actor',
                value: response.data.workflow_runs[0].actor.login,
            },
            {
                name: 'workflow_id',
                value: response.data.workflow_runs[0].workflow_id,
            },
            {
                name: 'idActor',
                value: response.data.workflow_runs[0].actor.id,
            },
            {
                name: 'idRepo',
                value: response.data.workflow_runs[0].repository.id,
            },
            {
                name: 'nameRepo',
                value: response.data.workflow_runs[0].repository.name,
            },
            {
                name: 'fullnameRepo',
                value: response.data.workflow_runs[0].repository.full_name,
            },
            {
                name: 'repoName',
                value: repos,
            },
            {
                name: 'orgName',
                value: org,
            },
        ];
    } catch (e) {
        log.error(`email:${email} service:Github ${e}`);
        return false;
    }
}
