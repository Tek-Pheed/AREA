import { Express, Request, Response, Router } from 'express';
import API from '../../middlewares/api';
import { login, register } from './auth.query';
import { IUsers } from '../../utils/data.model';
const jwt = require('jsonwebtoken');

export function generateToken(email: string): string {
    return jwt.sign({ email: email }, process.env.SECRET);
}

export const authRouter = Router();

authRouter.post('/login', async (req: any, res: Response) => {
    /*
        #swagger.tags = ['Auth']
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/req_login"
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: "Return access_token",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/auth"
                    }
                }
            }
        }
        #swagger.responses[400] = {
            description: "Error when credentials was missing",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/error_400"
                    }
                }
            }
        }
        #swagger.responses[401] = {
            description: "Error when bad credentials provided",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/error_401"
                    }
                }
            }
        }
    */
    res.header('Content-Type', 'application/json');
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json(
            API(400, true, 'Email or password is required', null)
        );
        return;
    }

    if (await login(email, password)) {
        res.status(200).json(
            API(200, false, '', { token: generateToken(email) })
        );
    } else {
        res.status(401).json(API(401, true, 'Bad credentials', null));
    }
});

authRouter.post('/register', async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Auth']
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/req_register"
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: "Return access_token",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/auth"
                    }
                }
            }
        }
        #swagger.responses[400] = {
            description: "Error when credentials was missing",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/error_400"
                    }
                }
            }
        }
        #swagger.responses[500] = {
            description: "Error when post data",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/error_500"
                    }
                }
            }
        }
    */
    res.header('Content-Type', 'application/json');
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
        res.status(400).json(
            API(400, true, 'Email, password or username is required', null)
        );
        return;
    }
    const user: IUsers = req.body;
    if (await register(user)) {
        res.status(200).json(
            API(200, false, '', { token: generateToken(email) })
        );
    } else {
        res.status(500).json(API(500, true, 'Error when creating user', null));
    }
});
