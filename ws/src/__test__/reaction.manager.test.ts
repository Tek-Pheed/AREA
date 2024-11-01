import { replaceLabel } from '../core/reaction.manager';
import { launchReaction } from '../core/reaction.manager';
import { IBody, IBodySpecific } from '../utils/data.model';
import { db, pool } from '../utils/database';

import * as spotifyReactions from '../core/reactions/spotify.reactions';
import * as twitchReactions from '../core/reactions/twitch.reactions';
import * as githubReactions from '../core/reactions/github.reactions';
import * as googleReactions from '../core/reactions/google.reactions';
import * as unsplashReactions from '../core/reactions/unsplash.reaction';

describe('reaction.manager.ts', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    afterAll(async () => {
        // Close the single db connection
        db.end((err) => {
            if (err) {
                console.error('Error closing the connection:', err);
            }
        });

        // If using pool, end all connections
        pool.end((err) => {
            if (err) {
                console.error('Error closing pool connections:', err);
            }
        });
    });

    describe('replaceLabel', () => {
        it('should return actions 13', () => {
            const actions = replaceLabel(
                'Hello, {{username}}!',
                'username',
                'Alice'
            );
            expect(actions).toEqual('Hello, Alice!');
        });
    });

    describe('reaction manager', () => {
        describe('launchReaction', () => {
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

            it('should call skipToNextMusic for "Skip to next"', async () => {
                jest.spyOn(
                    spotifyReactions,
                    'skipToNextMusic'
                ).mockImplementation(jest.fn());
                await launchReaction(
                    'Skip to next',
                    params,
                    actionParam,
                    email
                );
                expect(spotifyReactions.skipToNextMusic).toHaveBeenCalledWith(
                    email
                );
                await new Promise((r) => setTimeout(r, 500));
            });

            it('should call skipToPreviousMusic for "Skip to previous"', async () => {
                jest.spyOn(
                    spotifyReactions,
                    'skipToPreviousMusic'
                ).mockImplementation(jest.fn());
                await launchReaction(
                    'Skip to previous',
                    params,
                    actionParam,
                    email
                );
                expect(
                    spotifyReactions.skipToPreviousMusic
                ).toHaveBeenCalledWith(email);
                await new Promise((r) => setTimeout(r, 500));
            });

            it('should call startSpecificMusic for "Start music"', async () => {
                jest.spyOn(
                    spotifyReactions,
                    'startSpecificMusic'
                ).mockImplementation(jest.fn());
                await launchReaction('Start music', params, actionParam, email);
                expect(
                    spotifyReactions.startSpecificMusic
                ).toHaveBeenCalledWith(params, email);
                await new Promise((r) => setTimeout(r, 500));
            });

            it('should call createClipOnStream for "Create clip"', async () => {
                jest.spyOn(
                    twitchReactions,
                    'createClipOnStream'
                ).mockImplementation(jest.fn());
                await launchReaction('Create clip', params, actionParam, email);
                expect(twitchReactions.createClipOnStream).toHaveBeenCalledWith(
                    params,
                    email
                );
                await new Promise((r) => setTimeout(r, 500));
            });

            it('should call sendMessageInStreamerChat for "Send message in chat"', async () => {
                jest.spyOn(
                    twitchReactions,
                    'sendMessageInStreamerChat'
                ).mockImplementation(jest.fn());
                await launchReaction(
                    'Send message in chat',
                    params,
                    actionParam,
                    email
                );
                expect(
                    twitchReactions.sendMessageInStreamerChat
                ).toHaveBeenCalledWith(params, email);
                await new Promise((r) => setTimeout(r, 500));
            });

            it('should call createIssueOnRepo for "Create Issue"', async () => {
                jest.spyOn(
                    githubReactions,
                    'createIssueOnRepo'
                ).mockImplementation(jest.fn());
                await launchReaction(
                    'Create Issue',
                    params,
                    actionParam,
                    email
                );
                expect(githubReactions.createIssueOnRepo).toHaveBeenCalledWith(
                    params,
                    email
                );
                await new Promise((r) => setTimeout(r, 500));
            });

            it('should call createPR for "Create Pull Request"', async () => {
                jest.spyOn(githubReactions, 'createPR').mockImplementation(
                    jest.fn()
                );
                await launchReaction(
                    'Create Pull Request',
                    params,
                    actionParam,
                    email
                );
                expect(githubReactions.createPR).toHaveBeenCalledWith(
                    params,
                    email
                );
                await new Promise((r) => setTimeout(r, 500));
            });

            it('should call mergePR for "Merge Pull Request"', async () => {
                jest.spyOn(githubReactions, 'mergePR').mockImplementation(
                    jest.fn()
                );
                await launchReaction(
                    'Merge Pull Request',
                    params,
                    actionParam,
                    email
                );
                expect(githubReactions.mergePR).toHaveBeenCalledWith(
                    params,
                    email
                );
                await new Promise((r) => setTimeout(r, 500));
            });

            it('should call createComment for "Create Issue/PR Comment"', async () => {
                jest.spyOn(githubReactions, 'createComment').mockImplementation(
                    jest.fn()
                );
                await launchReaction(
                    'Create Issue/PR Comment',
                    params,
                    actionParam,
                    email
                );
                expect(githubReactions.createComment).toHaveBeenCalledWith(
                    params,
                    email
                );
                await new Promise((r) => setTimeout(r, 500));
            });

            it('should call reRunFailedWorkflow for "Re-run failed workflow"', async () => {
                jest.spyOn(
                    githubReactions,
                    'reRunFailedWorkflow'
                ).mockImplementation(jest.fn());
                await launchReaction(
                    'Re-run failed workflow',
                    params,
                    actionParam,
                    email
                );
                expect(
                    githubReactions.reRunFailedWorkflow
                ).toHaveBeenCalledWith(params, email);
                await new Promise((r) => setTimeout(r, 500));
            });

            it('should call reRunWorkflow for "Re-run a workflow"', async () => {
                jest.spyOn(githubReactions, 'reRunWorkflow').mockImplementation(
                    jest.fn()
                );
                await launchReaction(
                    'Re-run a workflow',
                    params,
                    actionParam,
                    email
                );
                expect(githubReactions.reRunWorkflow).toHaveBeenCalledWith(
                    params,
                    email
                );
                await new Promise((r) => setTimeout(r, 500));
            });

            it('should call setEventInCalendar for "Add event"', async () => {
                jest.spyOn(
                    googleReactions,
                    'setEventInCalendar'
                ).mockImplementation(jest.fn());
                await launchReaction('Add event', params, actionParam, email);
                expect(googleReactions.setEventInCalendar).toHaveBeenCalledWith(
                    params,
                    email
                );
                await new Promise((r) => setTimeout(r, 500));
            });

            it('should call likePhotoReaction for "Like a photo"', async () => {
                jest.spyOn(
                    unsplashReactions,
                    'likePhotoReaction'
                ).mockImplementation(jest.fn());
                await launchReaction(
                    'Like a photo',
                    params,
                    actionParam,
                    email
                );
                expect(
                    unsplashReactions.likePhotoReaction
                ).toHaveBeenCalledWith(params, email);
                await new Promise((r) => setTimeout(r, 500));
            });
        });
    });
});
