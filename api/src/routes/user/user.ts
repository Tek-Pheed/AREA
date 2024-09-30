import { Router, Request, Response } from 'express';
import { getCurrentUser } from './user.query';
import API from '../../middlewares/api';
import { userConfigRouter } from './configs/configs';

export const userRouter = Router();

userRouter.get('/me', async (req: Request, res: Response) => {
    // #swagger.tags = ['Users']
    res.header('Content-Type', 'application/json');
    const result = await getCurrentUser(req);
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

userRouter.use('/configs', userConfigRouter);
