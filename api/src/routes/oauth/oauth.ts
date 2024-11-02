import { Express, Request, Response, Router } from 'express';
import { spotifyRouter } from '../spotify/spotify';
import { twitchRouter } from '../twitch/twitch';
import { discordRouter } from '../discord/discord';
import { githubRouter } from '../github/github';
import { unsplashRouter } from '../unsplash/unsplash';
import { googleRouter } from '../google/google';

import {
    getAllConnections,
    insertTokeninDb,
    logoutService,
} from './oauth.query';
import API from '../../middlewares/api';
import { auth } from '../../middlewares/auth';

export const oauthRouter = Router();

oauthRouter.use('/spotify', spotifyRouter);
oauthRouter.use('/twitch', twitchRouter);
oauthRouter.use('/discord', discordRouter);
oauthRouter.use('/github', githubRouter);
oauthRouter.use('/unsplash', unsplashRouter);
oauthRouter.use('/google', googleRouter);

oauthRouter.get('/connections', auth, async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['OAuth']
        #swagger.responses[500] = {
            description: "Error when fetching connections",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/error_500"
                    }
                }
            }
        }
        #swagger.responses[401] = {
            description: "Error when bad credentials provided",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/error_401"
                    }
                }
            }
        }
    */
    res.header('Content-Type', 'application/json');
    const result = await getAllConnections(`${req.headers.authorization}`);
    if (result != null) {
        res.status(200).json(API(200, false, '', result));
    } else {
        res.status(500).json(
            API(500, true, 'Error when fetching connections', null)
        );
    }
});

oauthRouter.post(
    '/update/:email',
    auth,
    async (req: Request, res: Response) => {
        /*
            #swagger.tags = ['OAuth']
            #swagger.responses[200] = {
                description: "Tokens updated",
            }
            #swagger.responses[401] = {
                description: "Error when bad credentials provided",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/error_401"
                        }
                    }
                }
            }
        */
        res.header('Content-Type', 'application/json');
        const email = req.params.email;
        const { twitch, spotify, github, discord, google, unsplash } = req.body;

        if (
            twitch.access_token != undefined &&
            twitch.refresh_token != undefined
        ) {
            await insertTokeninDb(
                'twitch',
                twitch.access_token,
                twitch.refresh_token,
                email
            );
        }

        if (
            discord.access_token != undefined &&
            discord.refresh_token != undefined
        ) {
            await insertTokeninDb(
                'discord',
                discord.access_token,
                discord.refresh_token,
                email
            );
        }

        if (github.access_token != undefined) {
            await insertTokeninDb('github', github.access_token, null, email);
        }

        if (
            spotify.access_token != undefined &&
            spotify.refresh_token != undefined
        ) {
            await insertTokeninDb(
                'spotify',
                spotify.access_token,
                spotify.refresh_token,
                email
            );
        }

        if (
            google.access_token != undefined &&
            google.refresh_token != undefined
        ) {
            await insertTokeninDb(
                'google',
                google.access_token,
                google.refresh_token,
                email
            );
        }

        if (unsplash.access_token != undefined) {
            await insertTokeninDb(
                'unsplash',
                unsplash.access_token,
                null,
                email
            );
        }

        res.status(200).json(API(200, false, 'Tokens updated', null));
    }
);

oauthRouter.delete(
    '/logout/:service/:email',
    auth,
    async (req: Request, res: Response) => {
        /*
            #swagger.tags = ['OAuth']
            #swagger.responses[500] = {
                description: "Error logging out of service",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/error_500"
                        }
                    }
                }
            }
            #swagger.responses[200] = {
                description: "Log out success",
            }
            #swagger.responses[401] = {
                description: "Error when bad credentials provided",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/error_401"
                        }
                    }
                }
            }
        */
        res.header('Content-Type', 'application/json');
        const email = req.params.email;
        const service = req.params.service;

        const result = await logoutService(email, service);
        if (result != null) {
            res.status(200).json(API(200, false, '', result));
        } else {
            res.status(500).json(
                API(500, true, 'Error logging out of ' + service, null)
            );
        }
    }
);
