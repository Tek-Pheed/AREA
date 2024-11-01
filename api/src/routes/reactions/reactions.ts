import { Request, Response, Router } from 'express';
import API from '../../middlewares/api';
import {
    getAllReactions,
    getReactionAPI,
    getSpecificReaction,
} from './reactions.query';
import { auth } from '../../middlewares/auth';
import { actionsRouter } from '../actions/actions';
import { getSpecificAction } from '../actions/action.query';

export const reactionRouter = Router();

reactionRouter.get('/', auth, async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Reactions']
        #swagger.responses[200] = {
            description: "Return all reactions",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/reactions"
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
            description: "Error when fetching reactions",
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
    const data = await getAllReactions();
    if (data !== null) {
        res.status(200).json(API(200, false, '', data));
    } else {
        res.status(500).json(
            API(500, true, 'Error when fetching reactions', null)
        );
    }
});

reactionRouter.get('/api', auth, async (req: Request, res: Response) => {
    /*
            #swagger.tags = ['Reactions']
            #swagger.responses[200] = {
                description: "Return all api use for reactions",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#/components/schemas/reactions_api"
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
                description: "Error when fetching api reaction",
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
    const data = await getReactionAPI();
    if (data !== null) {
        res.status(200).json(API(200, false, '', data));
    } else {
        res.status(500).json(
            API(500, true, 'Error when fetching api reaction', null)
        );
    }
});

reactionRouter.get('/:id', auth, async (req: Request, res: Response) => {
    /*
            #swagger.tags = ['Reactions']
            #swagger.responses[200] = {
                description: "Return specific reaction by id",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#/components/schemas/reactions"
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
                description: "Error when fetching reaction",
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
    const data = await getSpecificReaction(`${req.params.id}`);
    if (data !== null) {
        res.status(200).json(API(200, false, '', data));
    } else {
        res.status(500).json(
            API(500, true, 'Error when fetching reaction', null)
        );
    }
});
