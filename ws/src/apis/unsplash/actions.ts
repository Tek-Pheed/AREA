import log from '../../utils/logger';
import { getUnsplashToken } from './unsplash.query';

const axios = require('axios');

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
        return [
            {
                name: 'id',
                value: response.data[0].id,
            },
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
