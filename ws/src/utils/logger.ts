import logger from 'pino';
import dayjs from 'dayjs';
import fs from 'fs';
import path from 'path';

const logDirectory = path.resolve(__dirname, '../../logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const logFile = path.join(logDirectory, 'app.log');

const log = logger({
    transport: {
        targets: [
            {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                },
                level: 'info',
            },
            {
                target: 'pino-pretty',
                options: {
                    colorize: false,
                    destination: logFile,
                },
                level: 'info',
            },
        ],
    },
    base: {
        pid: false,
    },
    timestamp: () => `,"time":"${dayjs().format()}"`,
});

export default log;
