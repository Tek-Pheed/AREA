import { Router, Request, Response } from 'express';
import { getCurrentUser, updateCurrentUser } from './user.query';
import API from '../../middlewares/api';
import { userConfigRouter } from './configs/configs';
import { auth } from '../../middlewares/auth';
import { generateToken } from '../auth/auth';

export const userRouter = Router();

userRouter.get('/me', auth, async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Users']
        #swagger.responses[200] = {
            description: "Return current user informations",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/users"
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
        #swagger.responses[500] = {
            description: "Error when getting current user",
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
    const result = await getCurrentUser(`${req.headers.authorization}`);
    if (result) {
        res.status(200).json(API(200, false, '', result));
    } else {
        res.status(500).json(
            API(500, true, 'Error when getting current user', null)
        );
    }
});

userRouter.put('/me', auth, async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Users']
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/req_users"
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: "Return new access_token",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/auth"
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
        #swagger.responses[500] = {
            description: "Error when updating user",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/error_500"
                    }
                }
            }
        }
    */
    const result = await updateCurrentUser(
        `${req.headers.authorization}`,
        req.body
    );
    if (result) {
        res.status(200).json(
            API(200, false, '', { access_token: generateToken(req.body.email) })
        );
    } else {
        res.status(500).json(API(500, true, 'Error when updating user', null));
    }
});

userRouter.use('/configs', userConfigRouter);
