import AsyncStorage from "@react-native-community/async-storage";
import { Platform } from "react-native";
import { downloadMedia, fetchAudioStream, fetchVideoInfo } from "../remote/API";

export var localIDs = null;

if (Platform.OS == "web")
    var db = null; 

async function loadSongList(db) {
    localIDs = [];

    if (Platform.OS == "web") {
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
            console.log("opened DB");
            db = request.result;

            request = db.transaction("songs", "readonly")
                .objectStore("songs")
                .getAllKeys();

            request.onsuccess = event => {
                localIDs = request.result;
                console.log(localIDs);
            };
        };

    } else {
        const keys = await AsyncStorage.getAllKeys();
        if (keys.length > 0) {
            for (let i = 0; i < keys.length; i++) {
                if (keys[i].includes('@storage_Song_')) {
                    localIDs.push(keys[i].substring(14));
                }
            }
        }
    }
}

loadSongList();

export async function loadSongLocal(id) {
    if (Platform.OS == "web") {
        return new Promise((resolve, reject) => {
            var request = indexedDB.open("storage");

            request.onerror = event => {
                console.log("failed opening DB: " + request.errorCode);
                reject("failed opening DB: " + request.errorCode);
            };

            request.onsuccess = event => {
                console.log("opened DB");
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

    } else {
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
}

export async function storeSong(id, track) {
    if (Platform.OS == "web") {
        return new Promise((resolve, reject) => {
            var request = indexedDB.open("storage");

            request.onerror = event => {
                console.log("failed opening DB: " + request.errorCode);
                reject("failed opening DB: " + request.errorCode);
            };

            request.onsuccess = event => {
                console.log("opened DB");
                db = request.result;

                db.transaction("songs", "readwrite")
                    .objectStore("songs")
                    .add({
                        id: id,
                        track: track
                    });

                resolve(track);
            };
        });

        return 
    } else {
        try {
            const string = JSON.stringify({
                id: id,
                picture: await pictureBlob.text(),
                audio: await audioBlob.text()
            });
    
            await AsyncStorage.setItem('@storage_Song_' + id, string);
            loadSongList();
        } catch(e) {
            console.log(e);
            alert("Storing song failed - " + id);
            return null;
        }
    }
}

export const downloadSong = async(id) => {
    let track = await fetchVideoInfo(id);
    track.url = await fetchAudioStream(id);

    track.artwork = await downloadMedia(track.artwork, targetHeader);
    track.url = await downloadMedia(track.url, targetHeader);

    storeSong(id, track);
}