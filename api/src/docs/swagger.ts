import swaggerAutogen from 'swagger-autogen';

export const options = {
    info: {
        title: 'AREA API',
        version: '1.0.0',
    },
    servers: [
        {
            url: 'http://localhost:3000/',
            description: 'Default server',
        },
    ],
    tags: [
        {
            name: 'Auth',
            description: '',
        },
        {
            name: 'Actions',
            description: '',
        },
        {
            name: 'Reactions',
            description: '',
        },
        {
            name: 'Users',
            description: '',
        },
        {
            name: 'Configs',
            description: '',
        },
        {
            name: 'OAuth',
            description: '',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
            },
        },
        schemas: {
            req_login: {
                email: 'string',
                password: 'string',
            },
            req_register: {
                username: 'string',
                email: 'string',
                password: 'string',
            },
            auth: {
                status: 200,
                error: false,
                message: 'string',
                data: {
                    access_token: 'string',
                },
            },
            actions: {
                status: 200,
                error: false,
                message: 'string',
                data: {
                    id: 0,
                    title: 'string',
                    description: 'string',
                    api_name: 'string',
                    ask_url: 'string',
                },
            },
            actions_api: {
                status: 200,
                error: false,
                message: 'string',
                data: {
                    id: 0,
                    name: 'string',
                },
            },
            reactions: {
                status: 200,
                error: false,
                message: 'string',
                data: {
                    id: 0,
                    title: 'string',
                    description: 'string',
                    api_name: 'string',
                    ask_url: 'string',
                },
            },
            reactions_api: {
                status: 200,
                error: false,
                message: 'string',
                data: {
                    id: 0,
                    name: 'string',
                },
            },
            users: {
                status: 200,
                error: false,
                message: 'string',
                data: {
                    id: 0,
                    email: 'string',
                    username: 'string',
                    create_at: Date.now(),
                },
            },
            configs: {
                status: 200,
                error: false,
                message: 'string',
                data: [
                    {
                        id: 0,
                        email: 'string',
                        action_id: 0,
                        method: ['GET', 'POST', 'PUT', 'DELETE'],
                        headers: 'json',
                        body: 'json',
                        reaction_id: 0,
                    },
                ],
            },
            configs_body: {
                action_id: 0,
                method: ['GET', 'POST', 'PUT', 'DELETE'],
                headers: 'json',
                body: 'json',
                reaction_id: 0,
            },
        },
    },
};

const outputFile = '../../swagger_output.json';
const endpointsFiles = ['../index.ts'];

swaggerAutogen({ openapi: '3.1.0' })(outputFile, endpointsFiles, options);
