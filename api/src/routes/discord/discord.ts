import { Response, Router } from 'express';
import { isAuthenticatedDiscord } from '../../middlewares/oauth';
import log from '../../utils/logger';

const axios = require('axios');
const passport: any = require('passport');

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;

const DiscordStrategy = require('passport-discord').Strategy;
const scopes = [
    'identify',
    'email',
    'guilds',
    'connections',
    'guilds.join',
    'guilds.members.read',
];

export const discordRouter = Router();

passport.use(
    new DiscordStrategy(
        {
            clientID: DISCORD_CLIENT_ID,
            clientSecret: DISCORD_CLIENT_SECRET,
            callbackURL: DISCORD_REDIRECT_URI,
            scope: scopes,
        },
        function (
            accessTokenDiscord: string,
            refreshTokenDiscord: string,
            profileDiscord: any,
            done: any
        ) {
            const user = {
                accessTokenDiscord,
                refreshTokenDiscord,
                profileDiscord,
            };
            done(null, user);
        }
    )
);

passport.serializeUser((user: any, done: any) => {
    done(null, user);
});

passport.deserializeUser((obj: any, done: any) => {
    done(null, obj);
});

discordRouter.get(
    '/login',
    passport.authenticate('discord'),
    async (req: any, res: Response) => {
        //#swagger.tags = ['Discord OAuth']
    }
);

discordRouter.get(
    '/callback',
    passport.authenticate('discord', {
        failureRedirect: '/api/oauth/discord/login',
    }),
    async function (req: any, res: Response) {
        res.redirect(
            `http://localhost:8081/dashboard/profile?api=discord&refresh_token=${req.user.refreshTokenDiscord}&access_token=${req.user.accessTokenDiscord}`
        );
        //#swagger.tags   = ['Discord OAuth']
    }
);
