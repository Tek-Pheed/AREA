import { Express, Request, Response, Router } from 'express';
import { getAllServices } from './services.query';
import API from '../../middlewares/api';

export const serviceRouter = Router();

serviceRouter.get('/', async (req: Request, res: Response) => {
    res.header('Content-Type', 'application/json');
    const data = await getAllServices();
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
            #swagger.tags = ['Services']
        */
        res.status(200).json(API(200, false, '', data));
    } else {
        res.status(500).json(
            API(500, true, 'Error when fetching services', null)
        );
    }
});
