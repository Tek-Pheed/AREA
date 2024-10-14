import log from '../../utils/logger';
import { getUnsplashToken } from './unsplash.query';

const axios = require('axios');

export async function getRandomPhotos(email: string): Promise<any> {
    const token = await getUnsplashToken(email);
    const response = await axios.get('https://api.unsplash.com/photos/random', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (response.data) {
        return true;
    } else {
        return false;
    }
}

export async function likePhoto(email: string, photo_id: string): Promise<any> {
    const token = await getUnsplashToken(email);
    const response = await axios.post(
        `https://api.unsplash.com/photos/${photo_id}/like`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    if (response.data) {
        return true;
    } else {
        return false;
    }
}
