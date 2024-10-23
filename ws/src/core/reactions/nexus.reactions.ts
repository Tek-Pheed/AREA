import { IBody, IBodySpecific } from '../../utils/data.model';
import log from '../../utils/logger';
import { launchReaction } from '../reaction.manager';

export async function nexusReactions(
    reactionsList: IBody,
    actionParam: IBodySpecific[],
    email: string
) {
    for (const reaction of reactionsList.reaction) {
        if (reaction.reaction !== undefined && reaction.params !== undefined) {
            const body: IBody = {
                action: [],
                reaction: reaction.params,
            };
            await launchReaction(reaction.reaction, body, actionParam, email);
        }
    }
}
