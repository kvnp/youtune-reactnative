import {
    downloadMedia,
    fetchAudioInfo,
    fetchAudioStream
} from "../remote/API";

export var localIDs = null;
export var dbLoading = true;

var db = null;

async function loadSongList(db) {
    localIDs = [];

    var request = indexedDB.open("storage", 1);
    request.onupgradeneeded = event => {
        let db = request.result;
        if (!db.objectStoreNames.contains('songs'))
            db.createObjectStore('songs', {keyPath: 'id'});

        console.log("DB upgraded");
    };

    request.onerror = event => {
        console.log("failed opening DB: " + request.errorCode);
    };

    request.onsuccess = event => {
        db = request.result;

        request = db.transaction("songs", "readonly")
            .objectStore("songs")
            .getAllKeys();

        request.onsuccess = event => {
            localIDs = request.result;
            dbLoading = false;
        };
    };
}

loadSongList();

export function loadSongLocal(id) {
    return new Promise((resolve, reject) => {
        var request = indexedDB.open("storage");

        request.onerror = event => {
            reject("failed opening DB: " + request.errorCode);
        };

        request.onsuccess = event => {
            db = request.result;

            request = db.transaction("songs", "readonly")
                .objectStore("songs")
                .get(id);

            request.onsuccess = event => {
                let track = request.result.track;
                resolve(track);
                track = null;
            };
            
        };
    });
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

        var request = indexedDB.open("storage");

        request.onerror = event => {
            reject("failed opening DB: " + request.errorCode);
        };

        request.onsuccess = event => {
            db = request.result;

            try {
                db.transaction("songs", "readwrite")
                    .objectStore("songs")
                    .add({
                        id: id,
                        track: track
                    });
            } catch (e) {
                if (!db.objectStoreNames.contains('songs'))
                    db.createObjectStore('songs', {keyPath: 'id'});

                db.transaction("songs", "readwrite")
                    .objectStore("songs")
                    .add({
                        id: id,
                        track: track
                    });
            }
            localIDs.push(id);
        };
        
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

        var request = indexedDB.open("storage");

        request.onerror = event => {
            reject("failed opening DB: " + request.errorCode);
        };

        request.onsuccess = event => {
            db = request.result;

            db.transaction("songs", "readwrite")
                .objectStore("songs")
                .delete(id);

            let index = localIDs.indexOf(id);
            localIDs.splice(index, 1);

            resolve(id);
        };
    });
}