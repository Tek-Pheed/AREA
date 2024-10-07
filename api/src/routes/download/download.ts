import { Response, Express, Router } from 'express';
import { auth } from '../../middlewares/auth';
const fs = require('fs');

export const downloadRouter = Router();

downloadRouter.get('/', auth, async (req, res: Response) => {
    if (fs.existsSync('/usr/src/app/src/output/area.apk')) {
        res.download('/usr/src/app/src/output/area.apk');
    } else {
        res.status(404).send('File not found');
    }
});
