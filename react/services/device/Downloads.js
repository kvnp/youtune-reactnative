import { DeviceEventEmitter } from "react-native";
import Media from "../api/Media";
import Storage from "./storage/Storage";

export default class Downloads {
    static #downloadedSongs = [];
    static #downloadQueue = [];
    static #initialized = false;

    static #emitter = DeviceEventEmitter;
    static #EVENT_REFRESH = "event-refresh";

    static addListener(event, listener) {
        return this.#emitter.addListener(event, listener);
    }

    static #initialize() {
        return new Promise(async(resolve, reject) => {
            if (this.#initialized)
                resolve(true);
            
            this.#downloadSong = await Storage.getAllKeys("Downloads");

            this.initialized = true;
            this.#emitter.emit(this.#EVENT_REFRESH, true);
            resolve(true);
        });
    }

    static deleteTrack(videoId) {
        // TODO check if track is liked; remove if it isnt liked
        // Storage.deleteItem("Songs", videoId);
        return Storage.deleteItem("Downloads", videoId);
    }

    static downloadTrack(videoId) {
        return new Promise((resolve, reject) => {
            if (videoId == undefined || videoId == null)
                reject("no id");

            let dlIndex = this.#downloadedSongs.findIndex(entry => videoId in entry);
            if (dlIndex > -1)
                reject("already downloaded");

            let qIndex = this.#downloadQueue.findIndex(entry => videoId in entry);
            if (qIndex > -1)
                reject("still downloading");
            
            let controllerCallback = controller => {
                let index = this.#downloadQueue.findIndex(entry => videoId in entry);
                if (index > -1)
                    this.#downloadQueue[index][videoId] = controller;
                else
                    this.#downloadQueue.push({[videoId] : controller});

                controller.signal.onabort = () => {
                    console.log("download aborted: " + id);
                };

                reject("download aborted");
            }

            let track = await Media.getAudioStream({videoId: videoId, controllerCallback});
            track.artwork = await Media.getBlob({url: track.artwork, controllerCallback});

            // TODO check if song is already liked
            Storage.setItem("Songs", track);

            let url = await Media.getAudioStream({videoId: videoId, controllerCallback});
            url = await Media.getBlob({url: url, controllerCallback});

            Storage.setItem("Downloads", {
                videoId: videoId,
                url: url
            });
            
            index = this.#downloadQueue.findIndex(entry => id in entry);
            this.#downloadQueue.splice(index, 1);
            resolve(id);
        });
    }

    static cancelDownload(videoId) {
        return new Promise((resolve, reject) => {
            let index = this.#downloadQueue.findIndex(entry => videoId in entry);
            if (index > -1) {
                let abortController = this.#downloadQueue[index][videoId];
                abortController.abort();
                downloadQueue.splice(index, 1);
                resolve(videoId);
            } else {
                reject(videoId);
            }
        });
    }

    static isTrackAvailable(videoId) {
        return new Promise(async(resolve, reject) => {
            if (!this.#initialized)
                await this.#initialize();

            resolve(this.#downloadedSongs.includes(videoId));
        });
    }

    static getTrack(videoId) {
        return new Promise(async(resolve, reject) => {
            if (!this.#initialized)
                await this.#initialize();

            if (!this.#downloadedSongs.includes(videoId))
                resolve(null);
            else {
                let track = await Storage.getItem("Tracks", videoId);
                //track.url = await Storage.getItem("Downloads", videoId);
                
                resolve(track);
            }
        });
    }

    static getDownload(videoId) {
        return new Promise(async(resolve, reject) => {
            if (!this.#initialized)
                await this.#initialize();

            if (!this.#downloadedSongs.includes(videoId))
                resolve(null);
            else {
                let url = await Storage.getItem("Downloads", videoId);
                
                resolve(url);
            }
        });
    }
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