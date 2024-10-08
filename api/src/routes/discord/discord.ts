import { Response, Router } from 'express';
import { isAuthenticatedDiscord } from '../../middlewares/oauth';

const axios = require('axios');
const passport: any = require('passport');

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;

const DiscordStrategy = require('passport-discord').Strategy;
const scopes = ['identify', 'email', 'guilds', 'guilds.join'];

export const discordRouter = Router();

export async function getInfoDiscord(token: string): Promise<any> {
    const response = await axios.get(`https://discord.com/api/users/@me`, {
        headers: {
            authorization: `Bearer ${token}`,
        },
    });
    if (!response.data) {
        return null;
    }
    return response.data || null;
}

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

discordRouter.get(
    '/get_discord_info',
    isAuthenticatedDiscord,
    async (req: any, res: Response) => {
        if (!req.user || !req.user.accessTokenDiscord) {
            return res.redirect('/api/oauth/discord/login');
        }
        try {
            let accessToken = req.user.accessTokenDiscord;
            let infos = await getInfoDiscord(accessToken);

            return res.json({ infos });
        } catch (error) {
            console.error('Error getting discord infos', error);
            return res.status(500).send('Error getting discord infos');
        }
        //#swagger.tags   = ['Discord OAuth']
    }
);
