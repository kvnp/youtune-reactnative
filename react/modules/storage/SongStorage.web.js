import {
    downloadMedia,
    fetchAudioInfo,
    fetchAudioStream
} from "../remote/API";

export var localIDs = null;

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
            };
            
        };
    });
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
            console.log(e);
            reject(e);
        }

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

        let index = downloadQueue.indexOf(id);
        downloadQueue.splice(index, 1);
        resolve(id);
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