import { Request, Response, Router } from 'express';
import { getJsonAbout } from './about.query';

export const aboutRouter = Router();

aboutRouter.get('/', async (req: Request, res: Response) => {
    const json = await getJsonAbout();

    let fJson = {
        client: {
            host: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        },
        server: {
            current_time: new Date().getTime(),
            ...json[0],
        },
    };

    res.status(200).json(fJson);
});
