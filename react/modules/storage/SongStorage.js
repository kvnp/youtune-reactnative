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

        let index = downloadQueue.findIndex(entry => id in entry);
        if (index > -1)
            reject("still downloading");

        let controllerCallback = controller => {
            let index = downloadQueue.findIndex(entry => id in entry);
            if (index > -1)
                downloadQueue[index][id] = controller;
            else
                downloadQueue.push({[id] : controller});

            controller.signal.onabort = () => {
                console.log("download aborted");
                reject(id);
            };
        }
        
        index = downloadQueue.findIndex(entry => id in entry);

        let track = await fetchAudioInfo({videoId: id, controllerCallback});
        track.url = await fetchAudioStream({videoId: id, controllerCallback});
        track.artwork = await downloadMedia({url: track.artwork, controllerCallback});
        track.url = await downloadMedia({url: track.url, controllerCallback});

        try {
            const string = JSON.stringify({
                id: id,
                track: track
            });
    
            await AsyncStorage.setItem('@storage_Song_' + id, string);
            localIDs.push(id);
        } catch (e) {
            reject("Storing song failed - " + id);
        }

        index = downloadQueue.findIndex(entry => id in entry);
        downloadQueue.splice(index, 1);
        resolve(id);
    });
}

export const abortSongDownload = id => {
    return new Promise((resolve, reject) => {
        let index = downloadQueue.findIndex(entry => id in entry);
        if (index > -1) {
            let abortController = downloadQueue[index][id];
            abortController.abort();
            downloadQueue.splice(index, 1);
            resolve(id);
        } else {
            reject(id);
        }
    });
}

export const deleteSong = id => {
    return new Promise((resolve, reject) => {
        if (id == undefined)
            reject("id is missing");

        try {
            AsyncStorage.removeItem('@storage_Song_' + id);

            let index = localIDs.indexOf(id);
            localIDs.splice(index, 1);
        } catch (e) {
            reject("Removing song failed - " + id);
        }
    });
}