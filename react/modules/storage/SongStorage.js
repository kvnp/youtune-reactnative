import AsyncStorage from "@react-native-community/async-storage";
import { Platform } from "react-native";
import { downloadMedia, fetchAudioStream, fetchVideoInfo } from "../remote/API";

export var localIDs = null;

async function loadSongList() {
    const keys = await AsyncStorage.getAllKeys();

    localIDs = [];
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

export async function storeSong(id, pictureBlob, audioBlob) {
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

export const downloadSong = async(id) => {
    let track = await fetchVideoInfo(id);
    track.url = await fetchAudioStream(id);

    let targetHeader;
    let thumbnailUrl;
    let audioUrl;

    if (Platform.OS == "web") {
        targetHeader = track.url.split("/")[2];
        thumbnailUrl = document.location.href + track.thumbnail.split("/").slice(3).join("/");
        audioUrl = document.location.href + "video/" + track.url.split("/").slice(3).join("/");
    } else {
        thumbnailUrl = track.thumbnail;
        audioUrl = track.url;
        targetHeader = null;
    }

    let pictureBlob = await downloadMedia(thumbnailUrl, targetHeader);
    let audioBlob = await downloadMedia(audioUrl, targetHeader);
    console.log(audioBlob);
    storeSong(id, pictureBlob, audioBlob);
}