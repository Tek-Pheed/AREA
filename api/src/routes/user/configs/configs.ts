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
            description: "Get all current user configs",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/configs"
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
            description: "Error when fetching all user configs",
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
        #swagger.tags = ['Configs']
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
        #swagger.responses[200] = {
            description: "User config create successfully",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/configs"
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
            description: "Error when creating user config",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/error_500"
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
        #swagger.tags = ['Configs']
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
        #swagger.responses[200] = {
            description: "User config update successfully",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#/components/schemas/configs"
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
            description: "Error when updating user config",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/error_500"
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
        #swagger.responses[200] = {
            description: "User config delete successfully",
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
            description: "Error when delete user config",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/error_500"
                    }
                }
            }
        }
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
