import { Response, Express, Router } from 'express';
import { auth } from '../../middlewares/auth';

export const downloadRouter = Router();

downloadRouter.get('/', auth, async (req, res: Response) => {
    res.download('/usr/src/app/src/output/area.apk');
});
