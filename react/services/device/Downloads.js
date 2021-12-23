import { DeviceEventEmitter } from "react-native";
import Media from "../api/Media";
import IO from "./IO";
import Storage from "./storage/Storage";

export default class Downloads {
    static downloadedTracks = [];
    static #cachedTracks = [];
    static #downloadQueue = [];
    static initialized = false;

    static #emitter = DeviceEventEmitter;
    static EVENT_REFRESH = "event-refresh";

    static addListener(event, listener) {
        return this.#emitter.addListener(event, listener);
    }

    static initialize() {
        return new Promise(async(resolve, reject) => {
            if (this.initialized)
                return resolve(true);
            
            this.downloadedTracks = await Storage.getAllKeys("Downloads");

            this.initialized = true;
            this.#emitter.emit(this.EVENT_REFRESH, true);
            resolve(true);
        });
    }

    static waitForInitialization() {
        return new Promise((resolve, reject) => {
            if (this.initialized)
                return resolve();

            let eventListener = this.addListener(
                this.EVENT_REFRESH,
                () => {
                    resolve();
                    eventListener.remove();
                }
            );
        });
    }

    static deleteTrack(videoId) {
        return new Promise(async(resolve, reject) => {
            if (!this.initialized)
                await Downloads.waitForInitialization();

            try {
                Storage.deleteItem("Tracks", videoId).then(() => {
                    Storage.deleteItem("Downloads", videoId).then(() => {
                        let index = this.downloadedTracks.indexOf(videoId);
                        if (index != -1)
                            this.downloadedTracks.splice(index, 1);

                        this.#emitter.emit(this.EVENT_REFRESH, true);
                        resolve();
                    });
                });
            } catch (e) {
                console.log(e);
            }
        });
    }

    static downloadTrack(videoId) {
        return new Promise(async(resolve, reject) => {
            if (!this.initialized)
                await Downloads.waitForInitialization();

            if (videoId == undefined || videoId == null)
                reject("no id");

            let dlIndex = this.downloadedTracks.findIndex(entry => videoId == entry);
            if (dlIndex > -1)
                reject("already downloaded");

            let qIndex = this.#downloadQueue.findIndex(entry => videoId in entry);
            if (qIndex > -1)
                reject("still downloading");
            
            let controllerCallback = controller => {
                let index = this.#downloadQueue.findIndex(entry => videoId in entry);   
                if (index > -1)
                    this.#downloadQueue[index][videoId] = controller;
                else {
                    this.#downloadQueue.push({[videoId] : controller});
                    this.#emitter.emit(this.EVENT_REFRESH, true);
                }

                controller.signal.onabort = () => {
                    reject("download aborted: " + videoId);
                };
            }
            
            try {
                let track = await Media.getAudioInfo({videoId: videoId, controllerCallback});
                track.artwork = await Media.getBlob({url: track.artwork, controllerCallback});
                track.videoId = track.id;
                delete track.id;
                delete track.playable;
                Storage.setItem("Tracks", track);

                let url = await Media.getAudioStream({videoId: videoId, controllerCallback});
                url = await Media.getBlob({url: url, controllerCallback});
                Storage.setItem("Downloads", {
                    videoId: videoId,
                    url: url
                });
                
                index = this.#downloadQueue.findIndex(entry => videoId in entry);
                this.#downloadQueue.splice(index, 1);
                this.downloadedTracks.push(videoId);
                this.#emitter.emit(this.EVENT_REFRESH, true);
                resolve(videoId);
            } catch (e) {
                console.log(e);
            }
        });
    }

    static cancelDownload(videoId) {
        return new Promise(async(resolve, reject) => {
            if (!this.initialized)
                await Downloads.waitForInitialization();

            let index = this.#downloadQueue.findIndex(entry => videoId in entry);
            if (index > -1) {
                let abortController = this.#downloadQueue[index][videoId];
                abortController.abort();
                this.#downloadQueue.splice(index, 1);
                this.#emitter.emit(this.EVENT_REFRESH, true);
                resolve(videoId);
            } else {
                reject(videoId);
            }
        });
    }

    static isTrackDownloaded(videoId) {
        if (!this.initialized || !videoId)
            return null;

        return this.downloadedTracks.includes(videoId);
    }

    static isTrackCached(videoId) {
        if (!this.initialized || !videoId)
            return null;

        return this.#cachedTracks.includes(videoId);
    }

    static isTrackDownloading(videoId) {
        if (!this.initialized || !videoId)
            return null;
        
        let index = this.#downloadQueue.findIndex(entry => videoId in entry);  
        return index > -1;
    }

    static getDownloadingLength() {
        if (!this.initialized)
            return 0;
        
        return this.#downloadQueue.length;
    }

    static getTrack(videoId) {
        return new Promise(async(resolve, reject) => {
            if (!this.initialized)
                await Downloads.waitForInitialization();

            if (!this.downloadedTracks.includes(videoId))
                return resolve(null);
            
            let track = await Storage.getItem("Tracks", videoId);
            //track.url = await Storage.getItem("Downloads", videoId);
            
            resolve(track);
        });
    }

    static getStream(videoId) {
        return new Promise(async(resolve, reject) => {
            if (!this.initialized)
                await Downloads.waitForInitialization();

            if (!this.downloadedTracks.includes(videoId))
                return resolve(null);

            let object = await Storage.getItem("Downloads", videoId);
            let url = IO.getBlobAsURL(object.url);
            resolve(url);
        });
    }

    static getDownload(videoId) {
        return new Promise(async(resolve, reject) => {
            if (!this.initialized)
                await Downloads.waitForInitialization();

            if (!this.downloadedTracks.includes(videoId))
                return resolve(null);
            
            let url = await Storage.getItem("Downloads", videoId);
            resolve(url);
        });
    }
}