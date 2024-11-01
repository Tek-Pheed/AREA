import { Router, Response, Request } from 'express';
import { auth } from '../../middlewares/auth';
import { getPresetsConfigs } from './presets.query';
import API from '../../middlewares/api';

export const presetsRouter = Router();

presetsRouter.get('/', auth, async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Presets']
        #swagger.responses[200] = {
            description: "Return all presets configs",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/preset"
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
            description: "Error when getting presets configs",
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
    const result = await getPresetsConfigs();
    if (result.length > 0) {
        res.status(200).json(API(200, false, '', result));
    } else {
        res.status(500).json(
            API(500, true, 'Error when getting presets configs', null)
        );
    }
});
