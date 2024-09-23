import { Request, Response, Router } from 'express';
import API from '../../middlewares/api';
import { getAllReactions } from './reactions.query';

export const reactionRouter = Router();

reactionRouter.get('/', async (req: Request, res: Response) => {
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
            API(500, true, 'Error when fetching actions', null)
        );
    }
});
