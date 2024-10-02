import { Request, Response, NextFunction, Express, Router } from 'express';
import { isAuthenticatedGoogle } from '../../middlewares/oauth';
import qs from 'qs'; // Make sure to install this package

const axios = require('axios');
const session = require('express-session');
const passport: any = require('passport');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
var GoogleStrategy = require('passport-google-oauth20');

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
            event, // This is the request body
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

            console.log('refresh', refreshTokenGoogle);
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
        /*
                #swagger.responses[200] = {
                    description: "Some description...",
                    content: {
                        "application/json": {
                            schema:{
                                $ref: "#/components/schemas/actions"
                            }
                        }
                    }
                }
                #swagger.tags   = ['Google OAuth']
            */
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
            `http://localhost:4200/profile?api=google&refresh_token=${req.user.refreshTokenGoogle}&access_token=${req.user.accessTokenGoogle}`
        );
        /*
                #swagger.responses[200] = {
                    description: "Some description...",
                    content: {
                        "application/json": {
                            schema:{
                                $ref: "#/components/schemas/actions"
                            }
                        }
                    }
                }
                #swagger.tags   = ['Google OAuth']
            */
    }
);

googleRouter.get(
    '/getCalendars',
    isAuthenticatedGoogle,
    async (req: any, res: Response) => {
        try {
            let accessToken = req.user.accessTokenGoogle;
            //const refreshToken = req.user.refreshTokenGoogle;
            let calendars = await setEventCalendarTest(accessToken);

            if (!calendars) {
                console.log('refreshing token');
                accessToken = await refreshGoogleAccessToken(
                    'ya29.a0AcM612wW9okJg8qji7mQ6JjqefcpCt70VM3o7R_ed8MaX8623SPDSXwIEwpZ2SG3RJjgBduLLXzUubpltMRyLDChwupkYJ4hoENYgoM-ZS5LqklQSCS03WlsNQ_aRRL4zPoOHYhnWlhz_eNRTmoqtFelY_OUpimBEUdDO1rRaCgYKAY4SARASFQHGX2MiCpMk8MBQJbylOFBrqrMqZA0175'
                );
                req.user.accessTokenGoogle = accessToken;
                calendars = await setEventCalendarTest(accessToken);
            }
        } catch (err) {
            console.error('Error setting event', err);
            return res.status(500).send('Error setting event');
        }
        return res.status(200).send('Event set');
    }
);
