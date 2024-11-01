import { Express, Request, Response, Router } from 'express';
import { getAllServices } from './services.query';
import API from '../../middlewares/api';

export const serviceRouter = Router();

serviceRouter.get('/', async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Services']
        #swagger.responses[200] = {
            description: "Return all services",
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
            description: "Error when fetching services",
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
    const data = await getAllServices();
    if (data !== null) {
        res.status(200).json(API(200, false, '', data));
    } else {
        res.status(500).json(
            API(500, true, 'Error when fetching services', null)
        );
    }
});
