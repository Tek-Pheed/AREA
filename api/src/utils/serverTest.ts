import { db } from '../database/db';

require('dotenv').config();
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import { authRouter } from '../routes/auth/auth';
import { actionsRouter } from '../routes/actions/actions';
import { reactionRouter } from '../routes/reactions/reactions';
import { userRouter } from '../routes/user/user';
import { oauthRouter } from '../routes/oauth/oauth';
import { serviceRouter } from '../routes/services/services';
import { downloadRouter } from '../routes/download/download';
import { logsRouter } from '../routes/logger/logs';
import { presetsRouter } from '../routes/presets/presets';
import { aboutRouter } from '../routes/about/about';

function createTestServer() {
    const app: Express = express();
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

    app.use('/api/auth', authRouter);
    app.use('/api/actions', actionsRouter);
    app.use('/api/reactions', reactionRouter);
    app.use('/api/users', userRouter);
    app.use('/api/oauth', oauthRouter);
    app.use('/api/services', serviceRouter);
    app.use('/api/download', downloadRouter);
    app.use('/api/logs', logsRouter);
    app.use('/api/presets', presetsRouter);
    app.use('/about.json', aboutRouter);

    return app;
}

export default createTestServer;
