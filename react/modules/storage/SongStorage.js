import AsyncStorage from "@react-native-async-storage/async-storage";

import {
    downloadMedia,
    fetchAudioInfo,
    fetchAudioStream
} from "../remote/API";

export var localIDs = null;

async function loadSongList(db) {
    localIDs = [];

    const keys = await AsyncStorage.getAllKeys();
    if (keys.length > 0) {
        for (let i = 0; i < keys.length; i++) {
            if (keys[i].includes('@storage_Song_')) {
                localIDs.push(keys[i].substring(14));
            }
        }
    }
}

loadSongList();

export async function loadSongLocal(id) {
    try {
        const value = await AsyncStorage.getItem('@storage_Song_' + id);

        if (value !== null)
            return JSON.parse(value);
        else
            return null;
    } catch(e) {
        alert("Loading sond failed - " + id);
        return null;
    }
}

export var downloadQueue = [];

export function storeSong(id) {
    return new Promise(async(resolve, reject) => {
        if (id == undefined || id == null)
            reject("no id");

        downloadQueue.push(id);

        let track;
        try {
            track = await fetchAudioInfo(id);
            track.url = await fetchAudioStream(id);

            track.artwork = await downloadMedia(track.artwork);
            track.url = await downloadMedia(track.url);
        } catch (e) {
            reject(e);
        }

        try {
            const string = JSON.stringify({
                id: id,
                track: track
            });
    
            await AsyncStorage.setItem('@storage_Song_' + id, string);
            localIDs.push(id);
        } catch(e) {
            reject("Storing song failed - " + id);
        }

        let index = downloadQueue.indexOf(id);
        downloadQueue.splice(index, 1);
        resolve(id);
    });
}

export const deleteSong = id => {
    return new Promise((resolve, reject) => {
        if (id == undefined)
            reject("id is missing");

    });
}