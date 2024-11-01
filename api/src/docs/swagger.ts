import swaggerAutogen from 'swagger-autogen';

export const options = {
    info: {
        title: 'AREA API',
        version: '1.0.0',
    },
    servers: [
        {
            url: 'http://localhost:8080/',
            description: 'Dev server',
        },
        {
            url: 'https://api.leafs-studio.com/',
            description: 'Production server',
        },
    ],
    tags: [
        {
            name: 'About.json',
            description: 'About.json file route',
        },
        {
            name: 'Auth',
            description: 'Authentication routes',
        },
        {
            name: 'Actions',
            description: 'Actions routes',
        },
        {
            name: 'Configs',
            description: 'Users configs routes',
        },
        {
            name: 'Discord OAuth',
            description: 'Discord oauth routes',
        },
        {
            name: 'Download APK',
            description: 'Download apk routes',
        },
        {
            name: 'Github OAuth',
            description: 'Github oauth routes',
        },
        {
            name: 'Google OAuth',
            description: 'Google oauth routes',
        },
        {
            name: 'Logger',
            description: 'Logger routes',
        },
        {
            name: 'OAuth',
            description: 'OAuth routes',
        },
        {
            name: 'Presets',
            description: 'Presets routes',
        },
        {
            name: 'Reactions',
            description: 'Reactions routes',
        },
        {
            name: 'Services',
            description: 'Services routes',
        },
        {
            name: 'Spotify OAuth',
            description: 'Spotify oauth routes',
        },
        {
            name: 'Twitch OAuth',
            description: 'Twitch oauth routes',
        },
        {
            name: 'Unsplash OAuth',
            description: 'Unsplash oauth routes',
        },
        {
            name: 'Users',
            description: 'Users routes',
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
            req_users: {
                username: 'string',
                email: 'string',
                password: 'string',
                picture_url: 'string',
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
            preset: {
                status: 200,
                error: false,
                message: 'string',
                data: [
                    {
                        id: 0,
                        action_id: 0,
                        reaction_id: 0,
                    },
                ],
            },
            error_500: {
                status: 500,
                error: true,
                message: 'Internal Server Error',
            },
            error_401: {
                status: 401,
                error: true,
                message: 'Unauthorized',
            },
            error_400: {
                status: 400,
                error: true,
                message: 'Bad request',
            },
            error_404: {
                status: 404,
                error: true,
                message: 'File not found',
            },
        },
    },
};

const outputFile = '../../swagger_output.json';
const endpointsFiles = ['../index.ts'];

swaggerAutogen({ openapi: '3.1.0' })(outputFile, endpointsFiles, options);
