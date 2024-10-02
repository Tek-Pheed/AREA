"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSongURL = getSongURL;
exports.getCurrentSong = getCurrentSong;
const spotify_query_1 = require("./spotify.query");
const axios = require('axios');
function getSongURL(name, access_token) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios.get(`https://api.spotify.com/v1/search?q=${name}&type=track`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        if (!response.data) {
            return false;
        }
        return response.data.tracks.items[0].external_urls.spotify;
    });
}
function getCurrentSong(email, target_song) {
    return __awaiter(this, void 0, void 0, function* () {
        const { sAccessToken, sRefreshToken } = yield (0, spotify_query_1.getSpotifyToken)(email);
        const song_url = yield getSongURL(target_song, sAccessToken);
        if (!song_url) {
            return false;
        }
        const response = yield axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
                Authorization: `Bearer ${sAccessToken}`,
            },
        });
        if (!response.data) {
            return false;
        }
        if (response.data.item.external_urls.spotify.includes(song_url)) {
            return {
                deviceName: response.data.device.name,
                repeatState: response.data.repeat_state,
                artistsName: response.data.item.artists.name,
                itemName: response.data.item.name,
            };
        }
        else
            return false;
    });
}
