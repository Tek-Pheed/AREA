import { Request, Response, NextFunction, Express } from 'express';
import { Passport } from 'passport';
import { isAuthenticatedDiscord } from '../../middlewares/oauth';

const axios = require('axios');
const session = require('express-session');

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;

const DiscordStrategy = require('passport-discord').Strategy;
const scopes = ['identify', 'email', 'guilds', 'guilds.join'];

export async function getInfoDiscord(token: string): Promise<any> {
    const response = await axios.get(`https://discord.com/api/users/@me`, {
        headers: {
            authorization: `Bearer ${token}`,
        },
    });
    console.log(response);
    if (!response.data) {
        return null;
    }
    return response.data || null;
}

module.exports = (app: Express, passport: any) => {
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

    app.get('/auth/discord', passport.authenticate('discord'));

    app.get(
        '/auth/discord/callback',
        passport.authenticate('discord', {
            failureRedirect: '/auth/discord',
        }),
        function (req: any, res: Response) {
            res.redirect('/api/get_discord_info');
        }
    );

    app.get(
        '/api/get_discord_info',
        isAuthenticatedDiscord,
        async (req: any, res: Response) => {
            if (!req.user || !req.user.accessTokenDiscord) {
                return res.redirect('/auth/discord');
            }
            try {
                let accessToken = req.user.accessTokenDiscord;
                let infos = await getInfoDiscord(accessToken);

                return res.json({ infos });
            } catch (error) {
                console.error('Error getting discord infos', error);
                return res.status(500).send('Error getting discord infos');
            }
        }
    );
};
