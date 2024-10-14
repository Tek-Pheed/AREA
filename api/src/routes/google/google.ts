import { Request, Response, NextFunction, Express, Router } from 'express';
import { isAuthenticatedGoogle } from '../../middlewares/oauth';
import qs from 'qs';

const axios = require('axios');
const session = require('express-session');
const passport: any = require('passport');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
var GoogleStrategy = require('passport-google-oauth20');

export async function getEvents(email: string) {
    //const { gAccessToken, gRefreshToken } = await getGoogleToken(email);
    const date = new Date();
    console.log(date);
    const rfc339 = date.toISOString();
    console.log(rfc339);
    try {
        const response = await axios.get(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${rfc339}`,
            {
                headers: {
                    Authorization: `Bearer ${email}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        for (let i = 0; i < response.data.items.length; i++) {
            if (
                response.data.items[i].start.dateTime.split('T')[0] ===
                rfc339.split('T')[0]
            )
                return [
                    {
                        name: 'title',
                        value: response.data.items[i].summary,
                    },
                    {
                        name: 'creator_email',
                        value: response.data.items[i].creator.email,
                    },
                    {
                        name: 'link',
                        value: response.data.items[i].htmlLink,
                    },
                ];
        }
        return false;
    } catch (err: any) {
        return false;
    }
}

export const googleRouter = Router();

export async function refreshGoogleAccessToken(refreshToken: string) {
    try {
        const response = await axios.post(
            'https://oauth2.googleapis.com/token',
            qs.stringify({
                client_id: GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        return response.data.access_token;
    } catch (err: any) {
        console.error(
            'Error refreshing access token:',
            err.response ? err.response.data : err.message
        );
        return null;
    }
}

export async function setEventCalendarTest(accessToken: string) {
    try {
        const event = {
            start: {
                dateTime: '2024-10-03T09:00:00-07:00',
                timeZone: 'Europe/Paris',
            },
            end: {
                dateTime: '2024-10-03T17:00:00-07:00',
                timeZone: 'Europe/Paris',
            },

            summary: 'TEST AREA',
            description:
                "A chance to hear more about Google's developer products.",
        };

        const response = await axios.post(
            'https://www.googleapis.com/calendar/v3/calendars/primary/events',
            event,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data;
    } catch (err: any) {
        console.error(
            'Error setting event:',
            err.response ? err.response.data : err.message
        );
        return null;
    }
}

passport.use(
    'google',
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: GOOGLE_REDIRECT_URI,
            scope: [
                'https://www.googleapis.com/auth/calendar',
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
            ],
            state: true,
        },
        function verify(
            accessTokenGoogle: string,
            refreshTokenGoogle: string,
            profileGoogle: any,
            cb: any
        ) {
            const user = {
                profileGoogle,
                accessTokenGoogle,
                refreshTokenGoogle,
            };
            cb(null, user);
        }
    )
);

passport.serializeUser((user: any, done: any) => {
    done(null, user);
});

passport.deserializeUser((obj: any, done: any) => {
    done(null, obj);
});

googleRouter.get(
    '/login',
    passport.authenticate('google', { accessType: 'offline' }),
    function (req, res) {
        //#swagger.tags   = ['Google OAuth']
    }
);

googleRouter.use(
    session({
        secret: process.env.SESSION_SECRET || 'default_secret',
        resave: false,
        saveUninitialized: true,
    })
);

googleRouter.get(
    '/callback',
    passport.authenticate('google', {
        failureRedirect: '/api/oauth/google/login',
    }),
    async (req: any, res: Response) => {
        res.redirect(
            `http://localhost:8081/profile?api=google&refresh_token=${req.user.refreshTokenGoogle}&access_token=${req.user.accessTokenGoogle}`
        );
        //res.redirect('http://localhost:8080/api/oauth/google/getCalendars');
        // #swagger.tags   = ['Google OAuth']
    }
);

googleRouter.get(
    '/getCalendars',
    isAuthenticatedGoogle,
    async (req: any, res: Response) => {
        try {
            let accessToken = req.user.accessTokenGoogle;
            let calendars = await getEvents(accessToken);
            return res.status(200).json({ calendars });
        } catch (err) {
            console.error('Error setting event', err);
            return res.status(500).send('Error setting event');
        }
    }
);
