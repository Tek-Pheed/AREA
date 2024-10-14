import { Router, Request, Response } from 'express';
import { getCurrentUser, updateCurrentUser } from './user.query';
import API from '../../middlewares/api';
import { userConfigRouter } from './configs/configs';
import { auth } from '../../middlewares/auth';
import { generateToken } from '../auth/auth';

export const userRouter = Router();

userRouter.get('/me', auth, async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    res.header('Content-Type', 'application/json');
    const result = await getCurrentUser(`${req.headers.authorization}`);
    if (result) {
        /*
            #swagger.responses[200] = {
                description: "Some description...",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#/components/schemas/users"
                        }
                    }
                }
            }
        */
        res.status(200).json(API(200, false, '', result));
    } else {
        res.status(500).json(
            API(500, true, 'Error when getting current user', null)
        );
    }
});

userRouter.put('/me', auth, async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
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
