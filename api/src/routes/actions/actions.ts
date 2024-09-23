import { Express, Request, Response } from 'express';
import { getAllActions } from './action.query';
import API from '../../middlewares/api';

module.exports = (app: Express) => {
    app.get('/api/actions', async (req: Request, res: Response) => {
        res.header('Content-Type', 'application/json');
        const data = await getAllActions();
        if (data !== null) {
            res.status(200).json(API(200, false, '', data));
        } else {
            res.status(500).json(
                API(500, true, 'Error when fetching actions', null)
            );
        }
    });
};
