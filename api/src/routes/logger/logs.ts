import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { auth } from '../../middlewares/auth';

export const logsRouter = Router();

logsRouter.get('/:email/:service', auth, (req, res) => {
    /*
        #swagger.tags = ['Logger']
        #swagger.responses[404] = {
            description: "No logs found",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/error_404"
                    }
                }
            }
        }
        #swagger.responses[500] = {
            description: "Failed to read log file",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/error_500"
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: "Return log of service",
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
    */
    const { email, service } = req.params;
    const log_path = process.env.LOG_FILE!;
    const logFilePath = path.join(__dirname, log_path);

    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read log file' });
        }

        if (data) {
            const logs = data
                .split('\n')
                .filter(
                    (log) =>
                        log.includes(email) &&
                        (service === 'all' || log.includes(service))
                )
                .map((log) =>
                    log.replace(new RegExp(`email:${email}`, 'g'), '')
                );
            return res.status(200).json({ logs });
        }

        return res.status(404).json({ error: 'No logs found' });
    });
});
