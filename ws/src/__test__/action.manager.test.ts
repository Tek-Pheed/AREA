import { launchAction } from '../core/action.manager';
import { IBody, IBodySpecific } from '../utils/data.model';
import { db, pool } from '../utils/database';

import * as spotifyActions from '../core/actions/spotify.actions';
import * as twitchActions from '../core/actions/twitch.actions';
import * as githubActions from '../core/actions/github.actions';
import * as discordActions from '../core/actions/discord.actions';
import * as googleActions from '../core/actions/google.actions';
import * as unsplashActions from '../core/actions/unsplash.actions';

describe('action.manager.ts', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    afterAll(async () => {
        db.end((err) => {
            if (err) {
                console.error('Error closing the connection:', err);
            }
        });
        pool.end((err) => {
            if (err) {
                console.error('Error closing pool connections:', err);
            }
        });
    });

    describe('reaction manager', () => {
        describe('launchAction', () => {
            const params: IBody = {
                reaction: [
                    {
                        value: 'test value',
                        name: '',
                    },
                ],
                action: [],
            };
            const actionParam: IBodySpecific[] = [
                { name: 'username', value: 'Alice' },
            ];
            const email = 'raphael.scandella@epitech.eu';
            const reaction = 'test';

            it('should call whenListenSpecificSound for "Listen specific sound"', async () => {
                jest.spyOn(
                    spotifyActions,
                    'whenListenSpecificSound'
                ).mockImplementation(jest.fn());
                await launchAction(
                    'Listen specific sound',
                    params,
                    email,
                    reaction
                );
                expect(
                    spotifyActions.whenListenSpecificSound
                ).toHaveBeenCalledWith(params, email, reaction);
                await new Promise((r) => setTimeout(r, 500));
            });

            it('should call liveStart for "Live starting"', async () => {
                jest.spyOn(twitchActions, 'liveStart').mockImplementation(
                    jest.fn()
                );
                await launchAction('Live starting', params, email, reaction);
                expect(twitchActions.liveStart).toHaveBeenCalledWith(
                    params,
                    email,
                    reaction
                );
                await new Promise((r) => setTimeout(r, 500));
            });

            it('should call getCurrentGameOfStreamer for "Specific game streamed"', async () => {
                jest.spyOn(
                    twitchActions,
                    'getCurrentGameOfStreamer'
                ).mockImplementation(jest.fn());
                await launchAction(
                    'Specific game streamed',
                    params,
                    email,
                    reaction
                );
                expect(
                    twitchActions.getCurrentGameOfStreamer
                ).toHaveBeenCalledWith(params, email, reaction);
                await new Promise((r) => setTimeout(r, 500));
            });

            it('should call getSpecificTitle for "Specific live title"', async () => {
                jest.spyOn(
                    twitchActions,
                    'getSpecificTitle'
                ).mockImplementation(jest.fn());
                await launchAction(
                    'Specific live title',
                    params,
                    email,
                    reaction
                );
                expect(twitchActions.getSpecificTitle).toHaveBeenCalledWith(
                    params,
                    email,
                    reaction
                );
                await new Promise((r) => setTimeout(r, 500));
            });

            it('should call getMostViewedCategory for "Game is the most streamed"', async () => {
                jest.spyOn(
                    twitchActions,
                    'getMostViewedCategory'
                ).mockImplementation(jest.fn());
                await launchAction(
                    'Game is the most streamed',
                    params,
                    email,
                    reaction
                );
                expect(
                    twitchActions.getMostViewedCategory
                ).toHaveBeenCalledWith(params, email, reaction);
                await new Promise((r) => setTimeout(r, 500));
            });

            it('should call whenNewCommitByMe for "Commit Specific User"', async () => {
                jest.spyOn(
                    githubActions,
                    'whenNewCommitByMe'
                ).mockImplementation(jest.fn());
                await launchAction(
                    'Commit Specific User',
                    params,
                    email,
                    reaction
                );
                expect(githubActions.whenNewCommitByMe).toHaveBeenCalledWith(
                    params,
                    email,
                    reaction
                );
                await new Promise((r) => setTimeout(r, 500));
            });

            it('should call whenLastWorkflowFailed for "Github action failed"', async () => {
                jest.spyOn(
                    githubActions,
                    'whenLastWorkflowFailed'
                ).mockImplementation(jest.fn());
                await launchAction(
                    'Github action failed',
                    params,
                    email,
                    reaction
                );
                expect(
                    githubActions.whenLastWorkflowFailed
                ).toHaveBeenCalledWith(params, email, reaction);
                await new Promise((r) => setTimeout(r, 500));
            });

            it('should call whenLastWorkflowSuccess for "Github action success"', async () => {
                jest.spyOn(
                    githubActions,
                    'whenLastWorkflowSuccess'
                ).mockImplementation(jest.fn());
                await launchAction(
                    'Github action success',
                    params,
                    email,
                    reaction
                );
                expect(
                    githubActions.whenLastWorkflowSuccess
                ).toHaveBeenCalledWith(params, email, reaction);
                await new Promise((r) => setTimeout(r, 500));
            });

            it('should call whenLastWorkflowInProgress for "Github action in progress"', async () => {
                jest.spyOn(
                    githubActions,
                    'whenLastWorkflowInProgress'
                ).mockImplementation(jest.fn());
                await launchAction(
                    'Github action in progress',
                    params,
                    email,
                    reaction
                );
                expect(
                    githubActions.whenLastWorkflowInProgress
                ).toHaveBeenCalledWith(params, email, reaction);
                await new Promise((r) => setTimeout(r, 500));
            });

            it('should call whenJoinNewServer for "Join new server"', async () => {
                jest.spyOn(
                    discordActions,
                    'whenJoinNewServer'
                ).mockImplementation(jest.fn());
                await launchAction('Join new server', params, email, reaction);
                expect(discordActions.whenJoinNewServer).toHaveBeenCalledWith(
                    params,
                    email,
                    reaction
                );
                await new Promise((r) => setTimeout(r, 500));
            });

            it('should call whenUsernameChange for "Change username"', async () => {
                jest.spyOn(
                    discordActions,
                    'whenUsernameChange'
                ).mockImplementation(jest.fn());
                await launchAction('Change username', params, email, reaction);
                expect(discordActions.whenUsernameChange).toHaveBeenCalledWith(
                    params,
                    email,
                    reaction
                );
                await new Promise((r) => setTimeout(r, 500));
            });

            it('should call whenThereIsAEventToday for "Event today"', async () => {
                jest.spyOn(
                    googleActions,
                    'whenThereIsAEventToday'
                ).mockImplementation(jest.fn());
                await launchAction('Event today', params, email, reaction);
                expect(
                    googleActions.whenThereIsAEventToday
                ).toHaveBeenCalledWith(params, email, reaction);
                await new Promise((r) => setTimeout(r, 500));
            });

            it('should call whenPostPhoto for "Post a picture"', async () => {
                jest.spyOn(unsplashActions, 'whenPostPhoto').mockImplementation(
                    jest.fn()
                );
                await launchAction('Post a picture', params, email, reaction);
                expect(unsplashActions.whenPostPhoto).toHaveBeenCalledWith(
                    params,
                    email,
                    reaction
                );
                await new Promise((r) => setTimeout(r, 500));
            });

            it('should call whenPostPhoto for "Listen to music"', async () => {
                jest.spyOn(spotifyActions, 'whenListen').mockImplementation(
                    jest.fn()
                );
                await launchAction('Listen to music', params, email, reaction);
                expect(spotifyActions.whenListen).toHaveBeenCalledWith(
                    params,
                    email,
                    reaction
                );
                await new Promise((r) => setTimeout(r, 500));
            });
        });
    });
});
