import log from '../../utils/logger';
import { getUnsplashToken } from './unsplash.query';

const axios = require('axios');

//Z9nOlaWAxQk1yzwIOrnt8y8zWW7FbvoqA18am1I8SBc

export async function getMonthsStats(
    email: string,
    elem: string,
    amount: string
): Promise<any> {
    const token = await getUnsplashToken(email);
    const response = await axios.get('https://api.unsplash.com/stats/month', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (response.data && response.data[`${elem}`].toString() >= amount) {
        return [
            {
                name: 'downloads',
                value: response.data.downloads,
            },
            {
                name: 'views',
                value: response.data.views,
            },
            {
                name: 'new_photos',
                value: response.data.new_photos,
            },
            {
                name: 'new_photographers',
                value: response.data.new_photographers,
            },
        ];
    } else {
        return null;
    }
}
