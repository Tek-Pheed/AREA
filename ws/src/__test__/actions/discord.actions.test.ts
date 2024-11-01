import {
    whenJoinNewServer,
    whenUsernameChange,
} from '../../core/actions/discord.actions';
import * as discordActions from '../../apis/discord/actions';
import * as storage from '../../utils/storage';
import * as reactionManager from '../../core/reaction.manager';
import { IBody } from '../../utils/data.model';
import { db, pool } from '../../utils/database';

jest.mock('../../apis/discord/actions');
jest.mock('../../utils/storage');
jest.mock('../../core/reaction.manager');
jest.mock('../../utils/database', () => ({
    db: {
        query: jest.fn(),
    },
    pool: {
        query: jest.fn(),
    },
}));

describe('Discord Actions', () => {
    const email = 'test@example.com';
    const reaction = [{ title: 'Test Reaction' }];
    const params: IBody = {
        action: [],
        reaction: [{ name: 'key', value: 'value' }],
    };

    describe('whenJoinNewServer', () => {
        it('should launch reaction if getDiscordLastServerName returns a result', async () => {
            const result = [{ name: 'Server1' }];
            (
                discordActions.getDiscordLastServerName as jest.Mock
            ).mockResolvedValue(result);

            await whenJoinNewServer(params, email, reaction, 0);

            expect(
                discordActions.getDiscordLastServerName
            ).toHaveBeenCalledWith(email);
            expect(reactionManager.launchReaction).toHaveBeenCalledWith(
                reaction[0].title,
                params,
                result,
                email
            );
        });

        it('should not launch reaction if getDiscordLastServerName returns false', async () => {
            (
                discordActions.getDiscordLastServerName as jest.Mock
            ).mockResolvedValue(false);

            await whenJoinNewServer(params, email, reaction, 0);

            expect(
                discordActions.getDiscordLastServerName
            ).toHaveBeenCalledWith(email);
            expect(reactionManager.launchReaction).not.toHaveBeenCalled();
        });
    });

    describe('whenUsernameChange', () => {
        it('should launch reaction if username has changed', async () => {
            const result = [{ value: 'newUsername' }];
            (discordActions.getDiscordUsername as jest.Mock).mockResolvedValue(
                result
            );
            (storage.readValue as jest.Mock).mockResolvedValue({
                username: 'oldUsername',
            });

            await whenUsernameChange(params, email, reaction, 0);

            expect(discordActions.getDiscordUsername).toHaveBeenCalledWith(
                email
            );
            expect(storage.createVariable).toHaveBeenCalledWith(
                `${email}-discord-0`
            );
            expect(storage.readValue).toHaveBeenCalledWith(
                `${email}-discord-0`
            );
            expect(storage.setItem).toHaveBeenCalledWith(
                `${email}-discord-0`,
                'username',
                'newUsername'
            );
            expect(reactionManager.launchReaction).toHaveBeenCalledWith(
                reaction[0].title,
                params,
                result,
                email
            );
        });

        it('should not launch reaction if username has not changed', async () => {
            const result = [{ value: 'sameUsername' }];
            (discordActions.getDiscordUsername as jest.Mock).mockResolvedValue(
                result
            );
            (storage.readValue as jest.Mock).mockResolvedValue({
                username: 'sameUsername',
            });

            await whenUsernameChange(params, email, reaction, 0);

            expect(discordActions.getDiscordUsername).toHaveBeenCalledWith(
                email
            );
            expect(storage.createVariable).toHaveBeenCalledWith(
                `${email}-discord-0`
            );
            expect(storage.readValue).toHaveBeenCalledWith(
                `${email}-discord-0`
            );
            expect(storage.setItem).not.toHaveBeenCalled();
            expect(reactionManager.launchReaction).not.toHaveBeenCalled();
        });

        it('should not launch reaction if getDiscordUsername returns false', async () => {
            (discordActions.getDiscordUsername as jest.Mock).mockResolvedValue(
                false
            );

            await whenUsernameChange(params, email, reaction, 0);

            expect(discordActions.getDiscordUsername).toHaveBeenCalledWith(
                email
            );
            expect(storage.createVariable).toHaveBeenCalledWith(
                `${email}-discord-0`
            );
            expect(storage.readValue).not.toHaveBeenCalled();
            expect(storage.setItem).not.toHaveBeenCalled();
            expect(reactionManager.launchReaction).not.toHaveBeenCalled();
        });
    });
});
