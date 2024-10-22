import { Router } from 'express';
import fs from 'fs';
import path from 'path';

export const logsRouter = Router();

logsRouter.get('/:email/:service', (req, res) => {
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
