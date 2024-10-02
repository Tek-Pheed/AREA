import dbConnect from './utils/database';
import { getActions, getReactions, getUsersConfigs } from './query/usersConfig';
import log from './utils/logger';
import { getSpecificSong } from './actions';
import { IBody, IBodySpecific } from './utils/data.model';
require('dotenv').config();

async function launchConfig(func: string, params: IBody, email: string) {
    log.info('Action: ', func);
    switch (func) {
        case 'When listen specific sound':
            for (const param of params.action) {
                if (param.name === 'songName') {
                    const result = await getSpecificSong(email, param.value);
                    console.log('result: ', result);
                }
            }
    }
}

async function reloadWS() {
    const configs = await getUsersConfigs();

    for (const config of configs) {
        const action = await getActions(`${config.actions_id}`);
        const reaction = await getReactions(`${config.actions_id}`);
        await launchConfig(
            action[0].title,
            config.body,
            'raphael.scandella@epitech.eu'
        );
    }
}

dbConnect.then(async () => {
    log.info('Connected to DB...');
    await reloadWS();
    setInterval(async () => {
        await reloadWS();
    }, 60000);
});
