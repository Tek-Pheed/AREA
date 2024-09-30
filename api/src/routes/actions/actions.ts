import e, { Express, Request, Response, Router } from 'express';
import {
    getActionsAPI,
    getAllActions,
    getStatusConnection,
} from './action.query';
import API from '../../middlewares/api';
import { auth } from '../../middlewares/auth';

export const actionsRouter = Router();

actionsRouter.get('/', auth, async (req: Request, res: Response) => {
    res.header('Content-Type', 'application/json');
    const data = await getAllActions();
    if (data !== null) {
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
            #swagger.tags = ['Actions']
        */
        res.status(200).json(API(200, false, '', data));
    } else {
        res.status(500).json(
            API(500, true, 'Error when fetching actions', null)
        );
    }
});

actionsRouter.get('/api', auth, async (req: Request, res: Response) => {
    res.header('Content-Type', 'application/json');
    const data = await getActionsAPI();
    if (data !== null) {
        /*
            #swagger.responses[200] = {
                description: "Some description...",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#/components/schemas/actions_api"
                        }
                    }
                }
            }
            #swagger.tags = ['Actions']
        */
        res.status(200).json(API(200, false, '', data));
    } else {
        res.status(500).json(
            API(500, true, 'Error when fetching actions', null)
        );
    }
});

actionsRouter.get(
    '/status/:email',
    /*auth,*/ async (req: Request, res: Response) => {
        res.header('Content-Type', 'application/json');
        const email = req.params.email;
        const data = await getStatusConnection(email);
        if (data !== null) {
            /*
            #swagger.responses[200] = {
                description: "Some description...",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#/components/schemas/actions_api"
                        }
                    }
                }
            }
            #swagger.tags = ['Actions']
        */
            res.status(200).json(API(200, false, '', data));
        } else {
            res.status(500).json(
                API(500, true, 'Error when fetching status', null)
            );
        }
    }
);
