import dbConnect from './utils/database';
import log from './utils/logger';
import fs from 'fs';
import { coreWS } from './core/webservice';
require('dotenv').config();

const wsInfo = JSON.parse(fs.readFileSync('package.json', 'utf8'));

dbConnect.then(async () => {
    log.info(`Starting WebService - ${wsInfo['name']} ${wsInfo['version']}`);
    log.info('Connected to DB...');
    if (!fs.existsSync('storage.json')) {
        fs.writeFileSync('storage.json', '{}');
    }
    await coreWS();
    setInterval(async () => {
        await coreWS();
    }, 60000);
});
