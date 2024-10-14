import { Response, Router } from 'express';

const AtlassianStrategy = require('passport-atlassian-oauth2');
const axios = require('axios');
const session = require('express-session');
const passport: any = require('passport');
const fetch = require('node-fetch');

const JIRA_CLIENT_ID = process.env.JIRA_CLIENT_ID;
const JIRA_CLIENT_SECRET = process.env.JIRA_CLIENT_SECRET;
const JIRA_REDIRECT_URI = process.env.JIRA_REDIRECT_URI;
const JIRA_SCOPES = [
    'read:jira-work',
    'manage:jira-project',
    'manage:jira-configuration',
    'read:jira-user',
    'write:jira-work',
    'manage:jira-webhook',
    'manage:jira-data-provider',
    'read:application-role:jira',
    'read:dashboard:jira',
    'delete:dashboard:jira',
    'read:dashboard.property:jira',
    'read:issue:jira',
    'report:personal-data',
];

export const jiraRouter = Router();

export async function getRessources(token: string): Promise<any> {
    const jql_query = 'assignee=currentUser()';
    const response = await axios.get(
        `https://api.atlassian.com/oauth/token/accessible-resources`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    console.log(response.data);
    if (!response.data) {
        return null;
    }
    return response.data || null;
}

export async function getIssues(token: string): Promise<any> {
    fetch('https://projets-teks.atlassian.net/rest/api/2/issue/AREA-61', {
        method: 'GET',
        headers: {
            Authorization: `Basic ${Buffer.from(
                `raphael.scandella@epitech.eu:${token}`
            ).toString('base64')}`,
            Accept: 'application/json',
        },
    })
        .then(async (response: any) => {
            console.log(`Response: ${response.status} ${response.statusText}`);
            const json = await response.json();
            return json;
        })
        .catch((err: any) => console.error(err));
}

passport.use(
    'jira',
    new AtlassianStrategy(
        {
            clientID: JIRA_CLIENT_ID,
            clientSecret: JIRA_CLIENT_SECRET,
            callbackURL: JIRA_REDIRECT_URI,
            scope: JIRA_SCOPES,
        },
        function (
            accessTokenJira: string,
            refreshTokenJira: string,
            profileJira: any,
            done: any
        ) {
            const user = {
                profileJira,
                accessTokenJira,
                refreshTokenJira,
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

jiraRouter.get('/login', passport.authenticate('jira'), function (req, res) {
    //#swagger.tags   = ['Jira OAuth']
});

jiraRouter.get(
    '/callback',
    passport.authenticate('jira', {
        failureRedirect: '/api/oauth/github/login',
    }),
    async function (req: any, res) {
        //console.log('callback');
        //console.log(req.user.accessTokenJira);
        //console.log(req.user.refreshTokenJira);
        //res.status(200).send('callback');
        //res.redirect(
        //    `http://localhost:8081/dashboard/profile/?api=github&refresh_token=${req.user.refreshTokenGithub}&access_token=${req.user.accessTokenGithub}`
        //);
        res.redirect('http://localhost:8080/api/oauth/jira/get_jira');
        //#swagger.tags   = ['Jira OAuth']
    }
);

jiraRouter.get('/get_jira', async (req: any, res: Response) => {
    if (!req.user || !req.user.accessTokenJira) {
        return res.redirect('/api/oauth/jira/login');
    }

    try {
        let accessToken = req.user.accessTokenJira;
        const issues = await getIssues(accessToken);
        return res.status(200).json({ issues });
    } catch (error) {
        console.error('Error getting issues ', error);
        return res.status(500).send('Error getting issues');
    }
    //#swagger.tags   = ['Jira OAuth']
});
getRessources;
