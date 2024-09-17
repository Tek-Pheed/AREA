import { Express, Request, Response } from 'express';
import API from '../../middlewares/api';
import { login, register } from './auth.query';
import { IUsers } from '../../utils/data.model';
const jwt = require('jsonwebtoken');

function generateToken(email: string): string {
    return jwt.sign({ email: email }, process.env.SECRET);
}

module.exports = (app: Express) => {
    app.post('/api/login', async (req: Request, res: Response) => {
        res.header('Content-Type', 'application/json');
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json(
                API(400, true, 'Email or password is required', null)
            );
        }

        if (await login(email, password)) {
            res.status(200).json(
                API(200, false, '', { token: generateToken(email) })
            );
        } else {
            res.status(401).json(API(401, true, 'Bad credentials', null));
        }
    });

    app.post('/api/register', async (req: Request, res: Response) => {
        res.header('Content-Type', 'application/json');
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            res.status(400).json(
                API(400, true, 'Email, password or username is required', null)
            );
        }
        const user: IUsers = req.body;
        if (await register(user)) {
            res.status(200).json(
                API(200, false, '', { token: generateToken(email) })
            );
        } else {
            res.status(500).json(
                API(500, true, 'Error when creating user', null)
            );
        }
    });
};
