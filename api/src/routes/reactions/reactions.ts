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
    res.header('Content-Type', 'application/json');
    const data = await getAllReactions();
    if (data !== null) {
        /*
            #swagger.responses[200] = {
                description: "Some description...",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#/components/schemas/reactions"
                        }
                    }
                }
            }
            #swagger.tags = ['Reactions']
        */
        res.status(200).json(API(200, false, '', data));
    } else {
        res.status(500).json(
            API(500, true, 'Error when fetching reactions', null)
        );
    }
});

reactionRouter.get('/api', auth, async (req: Request, res: Response) => {
    res.header('Content-Type', 'application/json');
    const data = await getReactionAPI();
    if (data !== null) {
        /*
            #swagger.responses[200] = {
                description: "Some description...",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#/components/schemas/reactions_api"
                        }
                    }
                }
            }
            #swagger.tags = ['Reactions']
        */
        res.status(200).json(API(200, false, '', data));
    } else {
        res.status(500).json(
            API(500, true, 'Error when fetching reactions', null)
        );
    }
});

reactionRouter.get('/:id', auth, async (req: Request, res: Response) => {
    /*
            #swagger.responses[200] = {
                description: "Some description...",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#/components/schemas/reactions"
                        }
                    }
                }
            }
            #swagger.tags = ['Reactions']
        */
    res.header('Content-Type', 'application/json');
    const data = await getSpecificReaction(`${req.params.id}`);
    if (data !== null) {
        res.status(200).json(API(200, false, '', data));
    } else {
        res.status(500).json(
            API(500, true, 'Error when fetching action', null)
        );
    }
});
