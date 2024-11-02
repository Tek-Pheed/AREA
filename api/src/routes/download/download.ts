import { Response, Request, Router } from 'express';
const fs = require('fs');

export const downloadRouter = Router();

downloadRouter.get('/', async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Download APK']
        #swagger.responses[404] = {
            description: "APK File not found",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/error_404"
                    }
                }
            }
        }
    */
    if (fs.existsSync('/usr/server/src/app/src/output/area.apk')) {
        res.download('/usr/server/src/app/src/output/area.apk');
    } else {
        res.status(404).send('File not found');
    }
});
