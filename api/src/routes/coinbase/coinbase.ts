import { Request, Response, NextFunction, Express, Router } from 'express';
import { stat } from 'fs';

const qs = require('qs');
const axios = require('axios');
const session = require('express-session');
const COINBASE_CLIENT_ID = process.env.COINBASE_CLIENT_ID;
const COINBASE_CLIENT_SECRET = process.env.COINBASE_CLIENT_SECRET;
const COINBASE_REDIRECT_URI = process.env.COINBASE_REDIRECT_URI;
const COINBASE_OAUTH_SCOPE = 'wallet:accounts:read,user';
const OAuth2Strategy = require('passport-oauth2').Strategy;
var express = require('express'),
    passport = require('passport'),
    util = require('util'),
    CoinbaseStrategy = require('passport-coinbase').Strategy;

export const coinbaseRouter = Router();

export async function listCoinbaseAccount(token: string): Promise<any> {
    const response = await axios.get('https://api.coinbase.com/v2/accounts', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    console.log(response.data);
    if (!response.data) {
        return null;
    }
    return response.data.item.name || null;
}

coinbaseRouter.use(
    session({
        secret: process.env.SESSION_SECRET || 'default_secret',
        resave: false,
        saveUninitialized: true,
    })
);

/*passport.use(
    'coinbase',
    new OAuth2Strategy(
        {
            authorizationURL: 'https://login.coinbase.com/oauth2/auth',
            tokenURL: 'https://login.coinbase.com/oauth2/token',
            clientID: COINBASE_CLIENT_ID,
            clientSecret: COINBASE_CLIENT_SECRET,
            callbackURL: COINBASE_REDIRECT_URI,
            scope: COINBASE_OAUTH_SCOPE,
            response_type: 'code',
        },
        function (
            accessTokenCoinbase: string,
            refreshTokenCoinbase: string,
            profileCoinbase: any,
            done: any
        ) {
            const user = {
                profileCoinbase,
                accessTokenCoinbase,
                refreshTokenCoinbase,
            };
            done(null, user);
        }
    )
);*/

passport.serializeUser((user: any, done: any) => {
    done(null, user);
});

passport.deserializeUser((obj: any, done: any) => {
    done(null, obj);
});

coinbaseRouter.get('/login', function (req, res) {
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
                #swagger.tags   = ['Coinbase OAuth']
        */
    res.redirect(
        `https://www.coinbase.com/oauth/authorize?response_type=code&client_id=${COINBASE_CLIENT_ID}&redirect_uri=${COINBASE_REDIRECT_URI}&state=secret_coinbase&scope=${COINBASE_OAUTH_SCOPE}`
    );
});

coinbaseRouter.get('/callback', async (req: any, res: Response) => {
    const { code, state } = req.query;
    console.log(code);
    console.log(state);
    console.log(
        COINBASE_CLIENT_ID,
        COINBASE_CLIENT_SECRET,
        COINBASE_REDIRECT_URI
    );
    if (state === 'secret_coinbase') {
        try {
            const response = await axios.post(
                'https://login.coinbase.com/oauth2/token',
                new URLSearchParams({
                    grant_type: 'authorization_code',
                    code: code,
                    client_id: COINBASE_CLIENT_ID!,
                    client_secret: COINBASE_CLIENT_SECRET!,
                    redirect_uri: COINBASE_REDIRECT_URI!,
                })
            );

            console.log(response.data);
            res.send({ response: response?.data });
        } catch (error: any) {
            console.error(
                'Error:',
                error.response ? error.response.data : error.message
            );
            res.send({
                error: error.response ? error.response.data : error.message,
            });
        }
    }
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
                #swagger.tags   = ['Coinbase OAuth']
        */
});

coinbaseRouter.get('/list_accounts', async (req: any, res: Response) => {
    /*if (!req.user || !req.user.accessTokenCoinbase) {
        return res.redirect('/api/oauth/coinbase/login');
    }
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
                #swagger.tags   = ['Coinbase OAuth']
            */
    try {
        let accessToken = req.user.accessTokenCoinbase;
        const refreshToken = req.user.refreshTokenCoinbase;
        let list_accounts = await listCoinbaseAccount(accessToken);

        /*if (!currentSong && refreshToken) {
            accessToken = await refreshCoinbaseToken(refreshToken);
            req.user.accessTokenCoinbase = accessToken;
            currentSong = await getCurrentSong(accessToken);
        }*/

        return res.json({ list_accounts });
    } catch (error) {
        console.error('Error fetching accounts', error);
        return res.status(500).send('Error fetching accounts');
    }
});
