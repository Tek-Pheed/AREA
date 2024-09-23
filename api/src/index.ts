import { options } from './docs/swagger';

require('dotenv').config();
import { Express } from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import dbConnect from './database/db';
import swaggerUi from 'swagger-ui-express';
import { authRouter } from './routes/auth/auth';
import { actionsRouter } from './routes/actions/actions';
import { reactionRouter } from './routes/reactions/reactions';

const app: Express = require('express')();
const port: number = 3000;
const pjson = require('../package.json');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerOutput = require('../swagger_output.json');

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

app.use('/api/auth', authRouter);
app.use('/api/actions', actionsRouter);
app.use('/api/reactions', reactionRouter);

require('./routes/twitch/twitch')(app);

app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerOutput, {
        customCss: '.swagger-ui .topbar { display: none }',
    })
);

dbConnect.then(() => {
    app.listen(port, () => {
        console.log(
            `${pjson.name} listening on port ${port} - version ${pjson.version}`
        );
    });
});
