import { getGithubToken } from './github.query';
import log from '../../utils/logger';
const axios = require('axios');

export async function getCommitFromSpecificUser(
    org: string,
    repos: string,
    email: string,
    access_token: string
): Promise<any> {
    try {
        const response = await axios.get(
            `https://api.github.com/orgs/${org}/${repos}/commits?author=${email}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    accept: 'application/vnd.github+json',
                },
            }
        );
        if (!response.data) {
            return false;
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
        log.error(e);
        return false;
    }
}

export async function getActionWhenKo(
    org: string,
    repos: string,
    access_token: string
): Promise<any> {
    try {
        const response = await axios.get(
            `https://api.github.com/repos/:org/:repos/actions/runs?status=failure`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    accept: 'application/vnd.github+json',
                },
            }
        );
        if (!response.data) {
            return false;
        }
        return [
            {
                name: 'id',
                value: response.data[0].workflows_runs.id,
            },
            {
                name: 'actor',
                value: response.data[0].workflows_runs.actor.login,
            },
            {
                name: 'workflow_id',
                value: response.data[0].workflows_runs.workflow_id,
            },
            {
                name: 'idActor',
                value: response.data[0].workflows_runs.actor.id,
            },
            {
                name: 'idRepo',
                value: response.data[0].workflows_runs.repository.id,
            },
            {
                name: 'nameRepo',
                value: response.data[0].workflows_runs.repository.name,
            },
            {
                name: 'fullnameRepo',
                value: response.data[0].workflows_runs.repository.full_name,
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
        log.error(e);
        return false;
    }
}

export async function getActionWhenOk(
    org: string,
    repos: string,
    access_token: string
): Promise<any> {
    try {
        const response = await axios.get(
            `https://api.github.com/repos/:org/:repos/actions/runs?status=success`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    accept: 'application/vnd.github+json',
                },
            }
        );
        if (!response.data) {
            return false;
        }
        return [
            {
                name: 'id',
                value: response.data[0].workflows_runs.id,
            },
            {
                name: 'actor',
                value: response.data[0].workflows_runs.actor.login,
            },
            {
                name: 'workflow_id',
                value: response.data[0].workflows_runs.workflow_id,
            },
            {
                name: 'idActor',
                value: response.data[0].workflows_runs.actor.id,
            },
            {
                name: 'idRepo',
                value: response.data[0].workflows_runs.repository.id,
            },
            {
                name: 'nameRepo',
                value: response.data[0].workflows_runs.repository.name,
            },
            {
                name: 'fullnameRepo',
                value: response.data[0].workflows_runs.repository.full_name,
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
        log.error(e);
        return false;
    }
}

export async function getActionInProgress(
    org: string,
    repos: string,
    access_token: string
): Promise<any> {
    try {
        const response = await axios.get(
            `https://api.github.com/repos/:org/:repos/actions/runs?status=in_progress`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    accept: 'application/vnd.github+json',
                },
            }
        );
        if (!response.data) {
            return false;
        }
        return [
            {
                name: 'id',
                value: response.data[0].workflows_runs.id,
            },
            {
                name: 'actor',
                value: response.data[0].workflows_runs.actor.login,
            },
            {
                name: 'workflow_id',
                value: response.data[0].workflows_runs.workflow_id,
            },
            {
                name: 'idActor',
                value: response.data[0].workflows_runs.actor.id,
            },
            {
                name: 'idRepo',
                value: response.data[0].workflows_runs.repository.id,
            },
            {
                name: 'nameRepo',
                value: response.data[0].workflows_runs.repository.name,
            },
            {
                name: 'fullnameRepo',
                value: response.data[0].workflows_runs.repository.full_name,
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
        log.error(e);
        return false;
    }
}
