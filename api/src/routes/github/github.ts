import { Response, Router } from 'express';
import { isAuthenticatedGithub } from '../../middlewares/oauth';
import log from '../../utils/logger';

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
        //#swagger.tags   = ['Github OAuth']
    }
);

githubRouter.get(
    '/callback',
    passport.authenticate('github', {
        failureRedirect: '/api/oauth/github/login',
    }),
    async function (req: any, res) {
        res.redirect(
            `http://localhost:8081/dashboard/profile/?api=github&refresh_token=${req.user.refreshTokenGithub}&access_token=${req.user.accessTokenGithub}`
        );
        //#swagger.tags   = ['Github OAuth']
    }
);
