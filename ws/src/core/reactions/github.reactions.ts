import { IBody } from '../../utils/data.model';
import log from '../../utils/logger';
import {
    createIssue,
    createIssueComment,
    createPullRequest,
    mergePullRequest,
    rerunWorkflow,
    rerunWorkflowFailedJobs,
} from '../../apis/github/reactions';

export async function createIssueOnRepo(params: IBody, email: string) {
    let data = [];
    for (const param of params.reaction) data.push(param.value);
    log.debug(data);
    const result = await createIssue(
        email,
        data[0],
        data[1],
        data[2],
        data[3],
        data[4],
        data[5].split(' ')
    );
    log.debug(result);
}

export async function createPR(params: IBody, email: string) {
    let data = [];
    for (const param of params.reaction) data.push(param.value);
    log.debug(data);
    const result = await createPullRequest(
        email,
        data[0],
        data[1],
        data[2],
        data[3],
        data[4],
        data[5],
        Boolean(data[6])
    );
    log.debug(result);
}

export async function mergePR(params: IBody, email: string) {
    let data = [];
    for (const param of params.reaction) data.push(param.value);
    log.debug(data);
    const result = await mergePullRequest(
        email,
        data[0],
        data[1],
        data[2],
        data[3],
        data[4]
    );
    log.debug(result);
}

export async function createComment(params: IBody, email: string) {
    let data = [];
    for (const param of params.reaction) data.push(param.value);
    log.info(data);
    const result = await createIssueComment(
        email,
        data[0],
        data[1],
        data[2],
        data[3]
    );
    log.info(result);
}

export async function reRunFailedWorkflow(params: IBody, email: string) {
    let data = [];
    for (const param of params.reaction) data.push(param.value);
    log.debug(data);
    const result = await rerunWorkflowFailedJobs(
        email,
        data[1],
        data[0],
        data[2],
        Boolean(data[3])
    );
    log.debug(result);
}

export async function reRunWorkflow(params: IBody, email: string) {
    let data = [];
    for (const param of params.reaction) data.push(param.value);
    log.debug(data);
    const result = await rerunWorkflow(
        email,
        data[1],
        data[0],
        data[2],
        Boolean(data[3])
    );
    log.debug(result);
}
