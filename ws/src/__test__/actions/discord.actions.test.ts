import * as discordActions from '../../core/actions/discord.actions';
import * as discordAction from '../../apis/discord/actions';
import { createVariable, readValue, setItem } from '../../utils/storage';
import { launchReaction } from '../../core/reaction.manager';
import { db, pool } from '../../utils/database';
import { IBody, IBodySpecific } from '../../utils/data.model';

describe('discord.actions.ts', () => {
    const params = { reaction: [], action: [] };
    const email = 'raphael.scandella@epitech.eu';
    const reaction = [{ title: 'Test Reaction' }];
    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    afterAll(async () => {
        try {
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
        } catch (err) {
            console.error('Error during afterAll:', err);
        }
    });

    describe('whenJoinNewServer', () => {
        it('should call launchReaction with correct parameters when getDiscordLastServerName returns data', async () => {
            const params: IBody = {
                reaction: [],
                action: [],
            };
            jest.spyOn(
                discordAction,
                'getDiscordLastServerName'
            ).mockImplementation(jest.fn());
            await discordActions.whenJoinNewServer(params, email, reaction);

            expect(discordAction.getDiscordLastServerName).toHaveBeenCalledWith(
                email
            );
            expect(launchReaction).toHaveBeenCalledWith(
                reaction[0].title,
                params,
                params,
                email
            );
        });

        it('should not call launchReaction when getDiscordLastServerName returns false', async () => {
            jest.spyOn(
                discordAction,
                'getDiscordLastServerName'
            ).mockImplementation(jest.fn());
            await discordActions.whenJoinNewServer(params, email, reaction);

            expect(discordAction.getDiscordLastServerName).toHaveBeenCalledWith(
                email
            );
            expect(launchReaction).not.toHaveBeenCalled();
        });
    });

    describe('whenUsernameChange', () => {
        it('should call launchReaction with correct parameters when username changes', async () => {
            jest.spyOn(
                discordAction,
                'getDiscordLastServerName'
            ).mockImplementation(jest.fn());
            const params: IBody = {
                reaction: [],
                action: [],
            };
            const ActionsParams: IBodySpecific = {
                name: '',
                value: '',
            };
            await discordActions.whenUsernameChange(params, email, reaction);

            expect(discordAction.getDiscordUsername).toHaveBeenCalledWith(
                email
            );
            expect(createVariable).toHaveBeenCalledWith(`${email}-discord`);
            expect(readValue).toHaveBeenCalledWith(`${email}-discord`);
            expect(setItem).toHaveBeenCalledWith(
                `${email}-discord`,
                'username',
                'NewUsername'
            );
            expect(launchReaction).toHaveBeenCalledWith(
                reaction[0].title,
                params,
                ActionsParams,
                email
            );
        });

        it('should not call launchReaction when username does not change', async () => {
            jest.spyOn(
                discordAction,
                'getDiscordLastServerName'
            ).mockImplementation(jest.fn());

            await discordActions.whenUsernameChange(params, email, reaction);

            expect(discordAction.getDiscordUsername).toHaveBeenCalledWith(
                email
            );
            expect(createVariable).toHaveBeenCalledWith(`${email}-discord`);
            expect(readValue).toHaveBeenCalledWith(`${email}-discord`);
            expect(setItem).not.toHaveBeenCalled();
            expect(launchReaction).not.toHaveBeenCalled();
        });

        it('should not call launchReaction when getDiscordUsername returns false', async () => {
            jest.spyOn(
                discordAction,
                'getDiscordLastServerName'
            ).mockImplementation(jest.fn());

            await discordActions.whenUsernameChange(params, email, reaction);

            expect(discordAction.getDiscordUsername).toHaveBeenCalledWith(
                email
            );
            expect(createVariable).toHaveBeenCalledWith(`${email}-discord`);
            expect(readValue).not.toHaveBeenCalled();
            expect(setItem).not.toHaveBeenCalled();
            expect(launchReaction).not.toHaveBeenCalled();
        });
    });
});
