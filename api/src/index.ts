require('dotenv').config();
import { Express } from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import dbConnect from './database/db';

const LocalStrategy = require('passport-local');
const app: Express = require('express')();
const port: number = 3000;
const pjson = require('../package.json');
const passport: any = require('passport');
require('https').globalAgent.options.rejectUnauthorized = false;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'default_secret',
        resave: false,
        saveUninitialized: true,
    })
);

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-Requested-With,content-type,Authorization,External-Authorization'
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

require('./routes/auth/auth')(app);
require('./routes/twitch/twitch')(app, passport);
require('./routes/spotify/spotify')(app, passport);

dbConnect.then(() => {
    app.listen(port, () => {
        console.log(
            `${pjson.name} listening on port ${port} - version ${pjson.version}`
        );
    });
});
