import { Response, Request, Router } from 'express';
const fs = require('fs');

export const downloadRouter = Router();

downloadRouter.get('/', async (req: Request, res: Response) => {
    if (fs.existsSync('/usr/src/app/src/output/area.apk')) {
        res.download('/usr/src/app/src/output/area.apk');
    } else {
        res.status(404).send('File not found');
    }
});
