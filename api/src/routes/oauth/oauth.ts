import { Express, Request, Response, Router } from 'express';
import { spotifyRouter } from '../spotify/spotify';
import { twitchRouter } from '../twitch/twitch';
import { discordRouter } from '../discord/discord';
import { githubRouter } from '../github/github';
import { insertTokeninDb } from './oauth.query';
import API from '../../middlewares/api';

export const oauthRouter = Router();

oauthRouter.use('/spotify', spotifyRouter);
oauthRouter.use('/twitch', twitchRouter);
oauthRouter.use('/discord', discordRouter);
oauthRouter.use('/github', githubRouter);

oauthRouter.post('/update/:email', async (req: Request, res: Response) => {
    const email = req.params.email;

    const twitchAccessToken = req.cookies.accessTokenTwitch;
    const spotifyAccessToken = req.cookies.accessTokenSpotify;
    const githubAccessToken = req.cookies.accessTokenGithub;
    const discordAccessToken = req.cookies.accessTokenDiscord;

    const twitchRefreshToken = req.cookies.refreshTokenTwitch;
    const spotifyRefreshToken = req.cookies.refreshTokenSpotify;
    const discordRefreshToken = req.cookies.refreshTokenDiscord;

    if (twitchAccessToken != undefined) {
        await insertTokeninDb(
            'twitch',
            email,
            twitchAccessToken,
            twitchRefreshToken
        );
    }
    if (spotifyAccessToken != undefined) {
        await insertTokeninDb(
            'spotify',
            email,
            spotifyAccessToken,
            spotifyRefreshToken
        );
    }
    if (githubAccessToken != undefined) {
        await insertTokeninDb('github', email, githubAccessToken, '');
    }
    if (discordAccessToken != undefined) {
        await insertTokeninDb(
            'discord',
            email,
            discordAccessToken,
            discordRefreshToken
        );
    }

    res.status(200).json(API(200, false, 'Tokens updated', null));
});
