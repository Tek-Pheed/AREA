import { Router, Request, Response } from 'express';
import { auth } from '../../../middlewares/auth';
import API from '../../../middlewares/api';
import {
    createUserConfig,
    getAllUserConfigs,
    removeUserConfig,
    updateUserConfig,
} from './configs.query';

export const userConfigRouter = Router();

userConfigRouter.get('/', async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Configs']
        #swagger.responses[200] = {
            description: "Some description...",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/configs"
                    }
                }
            }
        }
     */
    res.header('Content-Type', 'application/json');
    const result = await getAllUserConfigs(`${req.headers.authorization}`);
    if (result !== null) {
        res.status(200).json(API(200, false, '', result));
    } else {
        res.status(500).json(
            API(500, true, 'Error when fetching all user configs', null)
        );
    }
});

userConfigRouter.post('/', auth, async (req: Request, res: Response) => {
    /*
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/configs_body"
                    }
                }
            }
        }
        #swagger.tags = ['Configs']
        #swagger.responses[200] = {
            description: "Some description...",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/configs"
                    }
                }
            }
        }
    */
    const { actions_id, method, headers, body, reaction_id } = req.body;
    const result = await createUserConfig(
        [actions_id, method, headers, body, reaction_id],
        `${req.headers.authorization}`
    );
    if (result !== null) {
        res.status(200).json(
            API(200, false, 'User config create successfully', null)
        );
    } else {
        res.status(500).json(
            API(500, true, 'Error when creating user config', null)
        );
    }
});

userConfigRouter.put('/:id', auth, async (req: Request, res: Response) => {
    /*
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/configs_body"
                    }
                }
            }
        }
        #swagger.tags = ['Configs']
        #swagger.responses[200] = {
            description: "Some description...",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/configs"
                    }
                }
            }
        }
    */
    const result = await updateUserConfig(req.body, req.params.id);
    if (result) {
        res.status(200).json(
            API(200, false, 'User config update successfully', null)
        );
    } else {
        res.status(500).json(
            API(500, true, 'Error when updating user config', null)
        );
    }
});

userConfigRouter.delete('/:id', auth, async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Configs']
    */
    const result = await removeUserConfig(
        req.params.id,
        `${req.headers.authorization}`
    );
    if (result) {
        res.status(200).json(
            API(200, false, 'User config delete successfully', null)
        );
    } else {
        res.status(500).json(
            API(500, true, 'Error when delete user config', null)
        );
    }
});
