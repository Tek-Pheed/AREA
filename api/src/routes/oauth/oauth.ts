import { Express, Request, Response, Router } from 'express';
import { spotifyRouter } from '../spotify/spotify';
import { twitchRouter } from '../twitch/twitch';
import { discordRouter } from '../discord/discord';
import { githubRouter } from '../github/github';
import { coinbaseRouter } from '../coinbase/coinbase';

export const oauthRouter = Router();

oauthRouter.use('/spotify', spotifyRouter);
oauthRouter.use('/twitch', twitchRouter);
oauthRouter.use('/discord', discordRouter);
oauthRouter.use('/github', githubRouter);
oauthRouter.use('/coinbase', coinbaseRouter);
