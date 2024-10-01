import { Express, Request, Response, Router } from 'express';
import { spotifyRouter } from '../spotify/spotify';
import { twitchRouter } from '../twitch/twitch';
import { discordRouter } from '../discord/discord';
import { githubRouter } from '../github/github';
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

oauthRouter.post(
    '/update/:email',
    auth,
    async (req: Request, res: Response) => {
        const email = req.params.email;
        const { twitch, spotify, github, discord } = req.body;

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
                twitch.access_token,
                twitch.refresh_token,
                email
            );
        }

        if (
            github.access_token != undefined &&
            github.refresh_token != undefined
        ) {
            await insertTokeninDb(
                'github',
                github.access_token,
                github.refresh_token,
                email
            );
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

        res.status(200).json(API(200, false, 'Tokens updated', null));
    }
);

oauthRouter.get('/connections', auth, async (req: Request, res: Response) => {
    const result = await getAllConnections(`${req.headers.authorization}`);
    if (result != null) {
        res.status(200).json(API(200, false, '', result));
    } else {
        res.status(500).json(
            API(500, true, 'Error when fetching connections', null)
        );
    }
});

oauthRouter.delete(
    '/logout/:service/:email',
    auth,
    async (req: Request, res: Response) => {
        const email = req.params.email;
        const service = req.params.service;

        const result = await logoutService(email, service);
        if (result != null) {
            res.status(200).json(API(200, false, '', result));
        } else {
            res.status(500).json(
                API(500, true, 'Error loggint out of ' + service, null)
            );
        }
    }
);
