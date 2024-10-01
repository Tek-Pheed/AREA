import e, { Express, Request, Response, Router } from 'express';
import {
    getActionsAPI,
    getAllActions,
    getSpecificAction,
} from './action.query';
import API from '../../middlewares/api';
import { auth } from '../../middlewares/auth';
import { getReactionAPI } from '../reactions/reactions.query';

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

actionsRouter.get('/:id', auth, async (req: Request, res: Response) => {
    /*
    #swagger.tags = ['Actions']
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
     */
    res.header('Content-Type', 'application/json');
    const data = await getSpecificAction(`${req.params.id}`);
    if (data !== null) {
        res.status(200).json(API(200, false, '', data));
    } else {
        res.status(500).json(
            API(500, true, 'Error when fetching action', null)
        );
    }
});
