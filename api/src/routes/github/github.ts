import { Response, Router } from 'express';
import { isAuthenticatedGithub } from '../../middlewares/oauth';

const GitHubStrategy = require('passport-github2').Strategy;
const axios = require('axios');
const session = require('express-session');
const passport: any = require('passport');

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI;

export const githubRouter = Router();

export async function getIssues(token: string): Promise<any> {
    const response = await axios.get(`  https://api.github.com/issues`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.data) {
        return null;
    }
    return response.data || null;
}

async function refreshGithubToken(refreshToken: string): Promise<string> {
    if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
        throw new Error('Missing github Client ID or Client Secret');
    }

    const response = await axios.post(
        'https://github.com/login/oauth/access_token',
        new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
        }).toString(),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    );

    const newAccessToken = response.data.access_token;
    return newAccessToken;
}

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
            `http://localhost:8081/profile/?api=github&refresh_token=${req.user.refreshTokenGithub}&access_token=${req.user.accessTokenGithub}`
        );
        //#swagger.tags   = ['Github OAuth']
    }
);

githubRouter.get(
    '/get_issues',
    isAuthenticatedGithub,
    async (req: any, res: Response) => {
        if (!req.user || !req.user.accessTokenGithub) {
            return res.redirect('/api/oauth/github/login');
        }

        try {
            let accessToken = req.user.accessTokenGithub;
            const refreshToken = req.user.refreshTokenGithub;
            let issues = await getIssues(accessToken);

            if (!issues && refreshToken) {
                accessToken = await refreshGithubToken(refreshToken);
                req.user.accessTokenGithub = accessToken;
                issues = await getIssues(accessToken);
            }
            return res.json({ issues });
        } catch (error) {
            console.error('Error getting issues ', error);
            return res.status(500).send('Error getting issues');
        }
        //#swagger.tags   = ['Github OAuth']
    }
);
