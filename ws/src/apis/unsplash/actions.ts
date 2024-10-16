import log from '../../utils/logger';
import { getUnsplashToken } from './unsplash.query';

const axios = require('axios');

export async function getMonthsStats(
    email: string,
    elem: string,
    amount: string
): Promise<any> {
    const token = await getUnsplashToken(email);
    try {
        const response = await axios.get(
            'https://api.unsplash.com/stats/month',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
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
    } catch (error) {
        log.error(
            `email:${email} service:Unsplash Error fetching monthly stats ${error}`
        );
        return null;
    }
}

export async function getUserLastPictures(
    email: string,
    username: string
): Promise<any> {
    const token = await getUnsplashToken(email);
    try {
        const response = await axios.get(
            `https://api.unsplash.com/users/${username}/photos`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        //check if response.data[0].id != de celui stocké
        return [
            {
                name: 'link',
                value: response.data[0].urls.raw,
            },
            {
                name: 'likes',
                value: response.data[0].likes,
            },
        ];
    } catch (error) {
        log.error(
            `email:${email} service:Unsplash Error fetching photos of user ${error}`
        );
        return null;
    }
}
