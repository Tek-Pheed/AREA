import { NextFunction, Response, Router } from 'express';
import { isAuthenticatedGithub } from '../../middlewares/oauth';
import log from '../../utils/logger';
import { insertTokeninDb } from '../oauth/oauth.query';
import { twitchRouter } from '../twitch/twitch';

const GitHubStrategy = require('passport-github2').Strategy;
const axios = require('axios');
const session = require('express-session');
const passport: any = require('passport');

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI;

export const githubRouter = Router();

githubRouter.use(
    session({
        secret: process.env.SESSION_SECRET || 'default_secret',
        resave: false,
        saveUninitialized: true,
    })
);

passport.use(
    'github',
    new GitHubStrategy(
        {
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: GITHUB_REDIRECT_URI,
        },
        function (
            accessTokenGithub: string,
            refreshTokenGithub: string,
            profileGithub: any,
            done: any
        ) {
            const user = {
                profileGithub,
                accessTokenGithub,
                refreshTokenGithub,
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

githubRouter.get(
    '/login',
    passport.authenticate('github', { scope: ['user, repo'] }),
    function (req, res) {
        //#swagger.tags = ['Github OAuth']
    }
);

githubRouter.get(
    '/login/:email',
    (req: any, res: Response, next: NextFunction) => {
        const email = req.params.email;
        passport.authenticate('github', {
            scope: ['user, repo'],
            state: email,
        })(req, res, next);
    },
    async (req: any, res: Response) => {
        //#swagger.tags = ['Github OAuth']
    }
);

githubRouter.get(
    '/callback',
    passport.authenticate('github', {
        failureRedirect: '/api/oauth/github/login',
    }),
    async function (req: any, res) {
        //#swagger.tags = ['Github OAuth']
        const token: any = req.user;
        const email = req.query.state;
        await insertTokeninDb(
            'github',
            token.accessTokenGithub,
            null,
            `${email}`
        );
        const origin = req.headers['user-agent'];
        if (
            origin.toLowerCase().includes('android') ||
            origin.toLowerCase().includes('iphone')
        ) {
            res.send(
                '<body><h1>Your are login to github, you can close this modal !</h1><script>window.close()</script></body>'
            );
        } else {
            res.redirect(`${process.env.WEB_HOST}/dashboard/profile`);
        }
    }
);
