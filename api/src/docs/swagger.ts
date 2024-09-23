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
        },
    },
};

const outputFile = '../../swagger_output.json';
const endpointsFiles = ['../index.ts'];

swaggerAutogen({ openapi: '3.1.0' })(outputFile, endpointsFiles, options);
