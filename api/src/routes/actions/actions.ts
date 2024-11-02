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
    /*
        #swagger.tags = ['Actions']
        #swagger.responses[200] = {
            description: "Response 200 ok",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/actions"
                    }
                }
            }
        }
        #swagger.responses[401] = {
            description: "Error when authentication failed",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/error_401"
                    }
                }
            }
        }
        #swagger.responses[500] = {
            description: "Error when api can't get data",
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
    const data = await getAllActions();
    if (data !== null) {
        res.status(200).json(API(200, false, '', data));
    } else {
        res.status(500).json(
            API(500, true, 'Error when fetching actions', null)
        );
    }
});

actionsRouter.get('/api', auth, async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Actions']
        #swagger.responses[200] = {
            description: "Response 200 ok",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/actions_api"
                    }
                }
            }
        }
        #swagger.responses[401] = {
            description: "Error when authentication failed",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/error_401"
                    }
                }
            }
        }
        #swagger.responses[500] = {
            description: "Error when api can't get data",
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
    const data = await getActionsAPI();
    if (data !== null) {
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
                description: "Response 200 ok",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#/components/schemas/actions_api"
                        }
                    }
                }
            }
        #swagger.responses[401] = {
            description: "Error when authentication failed",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/error_401"
                    }
                }
            }
        }
        #swagger.responses[500] = {
            description: "Error when api can't get data",
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
    const data = await getSpecificAction(`${req.params.id}`);
    if (data !== null) {
        res.status(200).json(API(200, false, '', data));
    } else {
        res.status(500).json(
            API(500, true, 'Error when fetching action', null)
        );
    }
});
