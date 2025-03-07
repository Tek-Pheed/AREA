import log from './utils/logger';

require('dotenv').config();
import express from 'express';
import { Express } from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import dbConnect from './database/db';
import swaggerUi from 'swagger-ui-express';
import { authRouter } from './routes/auth/auth';
import { oauthRouter } from './routes/oauth/oauth';
import { actionsRouter } from './routes/actions/actions';
import { reactionRouter } from './routes/reactions/reactions';
import { userRouter } from './routes/user/user';
import { serviceRouter } from './routes/services/services';
import { downloadRouter } from './routes/download/download';
import { aboutRouter } from './routes/about/about';
import { logsRouter } from './routes/logger/logs';
import { presetsRouter } from './routes/presets/presets';

const app: Express = require('express')();
const port = process.env.API_PORT;
const pjson = require('../package.json');
const swaggerOutput = require('../swagger_output.json');
const passport: any = require('passport');
const cors = require('cors');
require('https').globalAgent.options.rejectUnauthorized = false;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
    cors({
        origin: '*', // Your Angular app's URL
        credentials: true,
    })
);

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'default_secret',
        resave: false,
        saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

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

app.use('/about.json', aboutRouter);
app.use('/api/auth', authRouter);
app.use('/api/actions', actionsRouter);
app.use('/api/download', downloadRouter);
app.use('/api/logs', logsRouter);
app.use('/api/oauth', oauthRouter);
app.use('/api/presets', presetsRouter);
app.use('/api/reactions', reactionRouter);
app.use('/api/services', serviceRouter);
app.use('/api/users', userRouter);

app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerOutput, {
        customCss: '.swagger-ui .topbar { display: none }',
    })
);

dbConnect.then(() => {
    app.listen(port, async () => {
        log.info('Connected to database');
        log.info(`${pjson.name} version ${pjson.version}`);
        log.info(`Listening on port ${port}`);
    });
});
